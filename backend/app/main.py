import logging
import json
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from uuid import uuid4

import httpx
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from redis import Redis
from redis.exceptions import RedisError
from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from .config import settings
from .database import Base, SessionLocal, engine
from .models import Activity, ApprovalTask, Integration, MemoryRecord
from .schemas import DecisionRequest, IntegrationUpdate, MemoryCreateRequest
from .seed import seed_database
from .vector_store import vector_store

logger = logging.getLogger(__name__)
redis_cache = (
    Redis.from_url(
        settings.redis_url,
        decode_responses=True,
        socket_connect_timeout=1,
        socket_timeout=1,
    )
    if settings.redis_url
    else None
)


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    vector_store.ensure_collection()
    with SessionLocal() as db:
        seed_database(db)
        if vector_store.enabled:
            records = db.scalars(
                select(MemoryRecord).where(MemoryRecord.vector_indexed.is_(False))
            ).all()
            for record in records:
                await vector_store.upsert(
                    record.id,
                    f"{record.cluster}\n{record.snippet}",
                    {
                        "id": record.id,
                        "type": record.type,
                        "cluster": record.cluster,
                        "snippet": record.snippet,
                        "agent": record.agent,
                    },
                )
                record.vector_indexed = True
                db.commit()
    yield


app = FastAPI(
    title="Pseudo Automation API",
    version="1.0.0",
    description="FastAPI service for the Pseudo Automation workflow dashboard.",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def to_approval(task: ApprovalTask) -> dict:
    return {
        "id": task.id,
        "title": task.title,
        "category": task.category,
        "riskLevel": task.risk_level,
        "targetEntity": task.target_entity,
        "confidenceScore": task.confidence_score,
        "aiReasoning": task.ai_reasoning,
        "timestamp": task.created_at.isoformat(),
        "agent": task.agent,
        "draftContent": task.draft_content,
        "policyChecks": task.policy_checks,
        "status": task.status,
        "executionStatus": task.execution_status,
        "rejectFeedback": task.reject_feedback,
    }


def to_activity(activity: Activity) -> dict:
    return {
        "id": activity.id,
        "timestamp": activity.timestamp.isoformat(),
        "step": activity.step,
        "agent": activity.agent,
        "agentRole": activity.agent_role,
        "action": activity.action,
        "details": activity.details,
        "status": activity.status,
        "latencyMs": activity.latency_ms,
    }


def to_integration(integration: Integration) -> dict:
    return {
        "id": integration.id,
        "name": integration.name,
        "category": integration.category,
        "icon": integration.icon,
        "connected": integration.connected,
        "lastSynced": integration.last_synced,
        "eventsProcessed": integration.events_processed,
        "dataIngestionActive": integration.data_ingestion_active,
        "description": integration.description,
    }


def to_memory(record: MemoryRecord, similarity: float = 0) -> dict:
    return {
        "id": record.id,
        "type": record.type,
        "cluster": record.cluster,
        "snippet": record.snippet,
        "similarity": similarity,
        "updated": record.updated_at.isoformat(),
        "agent": record.agent,
    }


def lexical_similarity(query: str, text: str) -> float:
    query_terms = set(query.casefold().split())
    if not query_terms:
        return 0.0
    text_terms = set(text.casefold().split())
    return len(query_terms & text_terms) / len(query_terms)


def invalidate_dashboard_cache() -> None:
    if not redis_cache:
        return
    try:
        redis_cache.delete("dashboard:summary")
    except RedisError as exc:
        logger.warning("Could not invalidate dashboard cache: %s", exc)


@app.get("/health")
def health():
    return {"status": "ok", "service": "pseudo-automation-api"}


@app.get("/api/health")
async def dependency_health():
    dependencies = {
        "database": (
            "postgresql"
            if settings.database_url.startswith("postgresql")
            else "sqlite"
        ),
        "qdrant": "not_configured",
        "redis": "not_configured",
    }
    if settings.qdrant_url:
        try:
            async with httpx.AsyncClient(timeout=3) as client:
                response = await client.get(
                    settings.qdrant_url.rstrip("/") + "/healthz",
                    headers=(
                        {"api-key": settings.qdrant_api_key}
                        if settings.qdrant_api_key
                        else None
                    ),
                )
                response.raise_for_status()
            dependencies["qdrant"] = "healthy"
        except httpx.HTTPError as exc:
            logger.warning("Qdrant health check failed: %s", exc)
            dependencies["qdrant"] = "unavailable"
    if settings.redis_url:
        client = None
        try:
            from redis.asyncio import Redis as AsyncRedis

            client = AsyncRedis.from_url(settings.redis_url, socket_timeout=3)
            await client.ping()
            dependencies["redis"] = "healthy"
        except RedisError as exc:
            logger.warning("Redis health check failed: %s", exc)
            dependencies["redis"] = "unavailable"
        finally:
            if client:
                await client.aclose()
    return {
        "status": "ok" if "unavailable" not in dependencies.values() else "degraded",
        "dependencies": dependencies,
        "vectorSearch": vector_store.enabled,
    }


@app.get("/api/dashboard")
def dashboard(db: Session = Depends(get_db)):
    if redis_cache:
        try:
            cached = redis_cache.get("dashboard:summary")
            if cached:
                return json.loads(cached)
        except (RedisError, json.JSONDecodeError) as exc:
            logger.warning("Could not read dashboard cache: %s", exc)

    pending = db.scalar(
        select(func.count()).select_from(ApprovalTask).where(ApprovalTask.status == "pending")
    ) or 0
    in_motion = db.scalar(
        select(func.count()).select_from(Activity).where(
            Activity.status.in_(("in_progress", "queued"))
        )
    ) or 0
    completed_events = db.scalar(
        select(func.count()).select_from(Activity).where(Activity.status == "completed")
    ) or 0
    total_events = db.scalar(select(func.count()).select_from(Activity)) or 0
    active_integrations = db.scalar(
        select(func.count()).select_from(Integration).where(
            Integration.data_ingestion_active.is_(True)
        )
    ) or 0
    result = {
        "pendingApprovals": pending,
        "inMotion": in_motion,
        "completedEvents": completed_events,
        "totalEvents": total_events,
        "activePipelines": active_integrations,
    }
    if redis_cache:
        try:
            redis_cache.set("dashboard:summary", json.dumps(result), ex=15)
        except RedisError as exc:
            logger.warning("Could not write dashboard cache: %s", exc)
    return result


@app.get("/api/approvals")
def list_approvals(db: Session = Depends(get_db)):
    tasks = db.scalars(
        select(ApprovalTask).order_by(ApprovalTask.created_at.desc())
    ).all()
    return [to_approval(task) for task in tasks]


@app.post("/api/approvals/{task_id}/decision")
async def decide_approval(
    task_id: str,
    request: DecisionRequest,
    db: Session = Depends(get_db),
):
    task = db.get(ApprovalTask, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Approval task not found.")
    decision_status = "approved" if request.decision == "approve" else "rejected"
    execution_status = (
        "awaiting_dispatch" if request.decision == "approve" else "cancelled"
    )
    changes = {
        "status": decision_status,
        "reject_feedback": request.feedback if request.decision == "reject" else None,
        "execution_status": execution_status,
        "updated_at": datetime.now(timezone.utc),
    }
    if request.decision == "approve" and request.draft_content is not None:
        changes["draft_content"] = request.draft_content
    changed = db.execute(
        update(ApprovalTask)
        .where(ApprovalTask.id == task_id, ApprovalTask.status == "pending")
        .values(**changes)
        .execution_options(synchronize_session=False)
    )
    if changed.rowcount != 1:
        db.rollback()
        task = db.get(ApprovalTask, task_id)
        if task is None:
            raise HTTPException(status_code=404, detail="Approval task not found.")
        raise HTTPException(
            status_code=409,
            detail=f"Task has already been {task.status}.",
        )

    db.expire_all()
    task = db.get(ApprovalTask, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Approval task not found.")
    now = task.updated_at
    action = "Human approved action" if request.decision == "approve" else "Human rejected action"
    details = (
        "Operator approved the quarantined action."
        if request.decision == "approve"
        else (
            f"Operator rejected the action. Feedback: {request.feedback}"
            if request.feedback
            else "Operator rejected the quarantined action."
        )
    )
    activity = Activity(
        id=f"ACT-{uuid4().hex[:12]}",
        timestamp=now,
        step="Act" if request.decision == "approve" else "Decide",
        agent="Action Agent" if request.decision == "approve" else "Decision Engine",
        agent_role="action" if request.decision == "approve" else "decision",
        action=f"{action}: {task.title}",
        details=details,
        status="completed",
        latency_ms=0,
    )
    db.add(activity)
    db.commit()
    db.refresh(task)
    invalidate_dashboard_cache()

    if request.decision == "approve" and settings.n8n_approval_webhook_url:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.post(
                    settings.n8n_approval_webhook_url,
                    json={"task": to_approval(task), "approvedAt": now.isoformat()},
                )
                response.raise_for_status()
            task.execution_status = "dispatched"
            db.add(
                Activity(
                    id=f"ACT-{uuid4().hex[:12]}",
                    timestamp=datetime.now(timezone.utc),
                    step="Act",
                    agent="n8n Orchestrator",
                    agent_role="action",
                    action=f"Dispatched approved action: {task.title}",
                    details="Approved action was accepted by the configured n8n webhook.",
                    status="completed",
                    latency_ms=0,
                )
            )
            db.commit()
            db.refresh(task)
            invalidate_dashboard_cache()
        except httpx.HTTPError as exc:
            logger.exception("n8n dispatch failed for approval %s", task_id)
            task.execution_status = "dispatch_failed"
            db.add(
                Activity(
                    id=f"ACT-{uuid4().hex[:12]}",
                    timestamp=datetime.now(timezone.utc),
                    step="Act",
                    agent="n8n Orchestrator",
                    agent_role="action",
                    action=f"n8n dispatch failed: {task.title}",
                    details="Approval was recorded, but dispatch to n8n failed.",
                    status="queued",
                    latency_ms=0,
                )
            )
            db.commit()
            invalidate_dashboard_cache()
            raise HTTPException(
                status_code=502,
                detail="Approval was recorded, but the configured n8n webhook could not be reached.",
            ) from exc

    return to_approval(task)


@app.get("/api/activities")
def list_activities(
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    activities = db.scalars(
        select(Activity).order_by(Activity.timestamp.desc()).limit(limit)
    ).all()
    return [to_activity(activity) for activity in activities]


@app.get("/api/integrations")
def list_integrations(db: Session = Depends(get_db)):
    integrations = db.scalars(select(Integration).order_by(Integration.id)).all()
    return [to_integration(integration) for integration in integrations]


@app.patch("/api/integrations/{integration_id}")
def update_integration(
    integration_id: str,
    request: IntegrationUpdate,
    db: Session = Depends(get_db),
):
    integration = db.get(Integration, integration_id)
    if integration is None:
        raise HTTPException(status_code=404, detail="Integration not found.")
    if request.data_ingestion_active and not integration.connected:
        raise HTTPException(
            status_code=409,
            detail="Connect this integration before enabling ingestion.",
        )
    integration.data_ingestion_active = request.data_ingestion_active
    db.commit()
    db.refresh(integration)
    invalidate_dashboard_cache()
    return to_integration(integration)


@app.get("/api/memory")
async def search_memory(
    q: str = Query(default="", max_length=500),
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    records = db.scalars(select(MemoryRecord)).all()
    if not q.strip():
        return [to_memory(record) for record in records[:limit]]

    vector_results = await vector_store.search(q, limit=limit)
    if vector_results:
        records_by_id = {record.id: record for record in records}
        matches = []
        for result in vector_results:
            record_id = str(result.get("id", ""))
            record = records_by_id.get(record_id)
            if record is not None:
                matches.append(to_memory(record, result["similarity"]))
        if matches:
            return matches

    scored = [
        (record, lexical_similarity(q, f"{record.cluster} {record.snippet} {record.type}"))
        for record in records
    ]
    scored = [(record, score) for record, score in scored if score > 0]
    scored.sort(key=lambda pair: pair[1], reverse=True)
    return [to_memory(record, score) for record, score in scored[:limit]]


@app.post("/api/memory", status_code=201)
async def create_memory(
    request: MemoryCreateRequest,
    db: Session = Depends(get_db),
):
    record = MemoryRecord(
        id=f"mem-{uuid4().hex[:12]}",
        type=request.type,
        cluster=request.cluster,
        snippet=request.snippet,
        agent=request.agent,
        updated_at=datetime.now(timezone.utc),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    try:
        await vector_store.upsert(
            record.id,
            f"{record.cluster}\n{record.snippet}",
            {
                "id": record.id,
                "type": record.type,
                "cluster": record.cluster,
                "snippet": record.snippet,
                "agent": record.agent,
            },
        )
        if vector_store.enabled:
            record.vector_indexed = True
            db.commit()
    except (httpx.HTTPError, RuntimeError):
        logger.exception("Vector indexing failed for memory %s", record.id)
        raise HTTPException(
            status_code=502,
            detail="Memory was stored, but vector indexing failed.",
        )
    return to_memory(record)


@app.post("/api/workflows/simulate")
def simulate_workflow(db: Session = Depends(get_db)):
    steps = [
        ("Collect", "Scout Agent: Ingesting Webhook", "scout"),
        ("Understand", "Interpreter Agent: NLP Extraction", "interpreter"),
        ("Decide", "Context Agent: Qdrant Vector Match", "context"),
        ("Act", "Action Agent: Outbound Relay", "action"),
        ("Verify", "Verifier Agent: Integrity Check", "verifier"),
        ("Remember", "Memory Base: Vector Synced", "memory"),
    ]
    now = datetime.now(timezone.utc)
    activities = [
        Activity(
            id=f"ACT-{uuid4().hex[:12]}",
            timestamp=now,
            step=step,
            agent=agent,
            agent_role=role,
            action=f"Simulated loop event at [{step}]",
            details=f"Test workflow step {index}/6 completed; no external actions were performed.",
            status="completed",
            latency_ms=0,
        )
        for index, (step, agent, role) in enumerate(steps, start=1)
    ]
    db.add_all(activities)
    db.commit()
    invalidate_dashboard_cache()
    return [to_activity(activity) for activity in activities]
