from typing import Any, Literal

from pydantic import BaseModel, Field


class DecisionRequest(BaseModel):
    decision: Literal["approve", "reject"]
    feedback: str | None = Field(default=None, max_length=2000)
    draft_content: dict[str, Any] | None = None


class IntegrationUpdate(BaseModel):
    data_ingestion_active: bool


class MemoryCreateRequest(BaseModel):
    type: str = Field(min_length=1, max_length=80)
    cluster: str = Field(min_length=1, max_length=200)
    snippet: str = Field(min_length=1, max_length=10000)
    agent: str = Field(min_length=1, max_length=120)
