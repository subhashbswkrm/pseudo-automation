import asyncio
from uuid import NAMESPACE_URL, uuid5

import httpx
from qdrant_client import QdrantClient, models

from .config import settings


class VectorStore:
    def __init__(self) -> None:
        self.client = (
            QdrantClient(
                url=settings.qdrant_url,
                api_key=settings.qdrant_api_key,
                timeout=5,
            )
            if settings.qdrant_url
            else None
        )

    @property
    def enabled(self) -> bool:
        return self.client is not None and settings.openai_api_key is not None

    def ensure_collection(self) -> None:
        if not self.client:
            return
        if not self.client.collection_exists(settings.qdrant_collection):
            self.client.create_collection(
                collection_name=settings.qdrant_collection,
                vectors_config=models.VectorParams(
                    size=1536,
                    distance=models.Distance.COSINE,
                ),
            )

    async def embed(self, text: str) -> list[float]:
        if not settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is required for vector memory.")
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                "https://api.openai.com/v1/embeddings",
                headers={"Authorization": f"Bearer {settings.openai_api_key}"},
                json={"model": settings.embedding_model, "input": text},
            )
            response.raise_for_status()
        return response.json()["data"][0]["embedding"]

    async def upsert(self, record_id: str, text: str, payload: dict) -> None:
        if not self.enabled or not self.client:
            return
        vector = await self.embed(text)
        await asyncio.to_thread(
            self.client.upsert,
            collection_name=settings.qdrant_collection,
            points=[
                models.PointStruct(
                    id=str(uuid5(NAMESPACE_URL, record_id)),
                    vector=vector,
                    payload=payload,
                )
            ],
            wait=True,
        )

    async def search(self, text: str, limit: int = 20) -> list[dict] | None:
        if not self.enabled or not self.client:
            return None
        vector = await self.embed(text)
        result = await asyncio.to_thread(
            self.client.query_points,
            collection_name=settings.qdrant_collection,
            query=vector,
            limit=limit,
            with_payload=True,
        )
        return [
            {
                **(point.payload or {}),
                "similarity": float(point.score),
            }
            for point in result.points
        ]


vector_store = VectorStore()
