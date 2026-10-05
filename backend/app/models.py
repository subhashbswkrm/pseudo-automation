from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class ApprovalTask(Base):
    __tablename__ = "approval_tasks"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    title: Mapped[str] = mapped_column(String(240), nullable=False)
    category: Mapped[str] = mapped_column(String(60), nullable=False)
    risk_level: Mapped[str] = mapped_column(String(20), nullable=False)
    target_entity: Mapped[str] = mapped_column(String(320), nullable=False)
    confidence_score: Mapped[int] = mapped_column(Integer, nullable=False)
    ai_reasoning: Mapped[str] = mapped_column(Text, nullable=False)
    agent: Mapped[str] = mapped_column(String(160), nullable=False)
    draft_content: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    policy_checks: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)
    execution_status: Mapped[str] = mapped_column(
        String(40), default="awaiting_approval", nullable=False
    )
    reject_feedback: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )
    step: Mapped[str] = mapped_column(String(20), nullable=False)
    agent: Mapped[str] = mapped_column(String(160), nullable=False)
    agent_role: Mapped[str] = mapped_column(String(40), nullable=False)
    action: Mapped[str] = mapped_column(String(320), nullable=False)
    details: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False)
    latency_ms: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class Integration(Base):
    __tablename__ = "integrations"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    category: Mapped[str] = mapped_column(String(120), nullable=False)
    icon: Mapped[str] = mapped_column(String(40), nullable=False)
    connected: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    last_synced: Mapped[str] = mapped_column(String(80), nullable=False)
    events_processed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    data_ingestion_active: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    description: Mapped[str] = mapped_column(Text, nullable=False)


class MemoryRecord(Base):
    __tablename__ = "memory_records"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    type: Mapped[str] = mapped_column(String(80), nullable=False)
    cluster: Mapped[str] = mapped_column(String(200), nullable=False)
    snippet: Mapped[str] = mapped_column(Text, nullable=False)
    agent: Mapped[str] = mapped_column(String(120), nullable=False)
    vector_indexed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )
