from typing import Literal

from pydantic import BaseModel, Field, field_validator


Priority = Literal["high", "medium", "low"]
Status = Literal["not_started", "in_progress", "done", "unknown"]
Confidence = Literal["high", "medium", "low"]
Severity = Literal["high", "medium", "low"]


def normalize_unknown(value):
    """
    将空字符串、None 统一转为 unknown。
    """
    if value is None:
        return "unknown"

    if isinstance(value, str) and not value.strip():
        return "unknown"

    return value


class MeetingOverview(BaseModel):
    meeting_title: str = "unknown"
    meeting_type: str = "unknown"
    meeting_date: str = "unknown"
    duration: str = "unknown"
    participants: list[str] = Field(default_factory=list)
    main_topics: list[str] = Field(default_factory=list)

    @field_validator(
        "meeting_title",
        "meeting_type",
        "meeting_date",
        "duration",
        mode="before",
    )
    @classmethod
    def normalize_empty_string(cls, value):
        return normalize_unknown(value)


class Decision(BaseModel):
    decision: str
    owner: str = "unknown"
    evidence_time: str = "unknown"
    evidence_segment_ids: list[str] = Field(default_factory=list)
    confidence: Confidence = "medium"

    @field_validator("owner", "evidence_time", mode="before")
    @classmethod
    def normalize_empty_string(cls, value):
        return normalize_unknown(value)


class ActionItem(BaseModel):
    task: str
    owner: str = "unknown"
    deadline: str = "unknown"
    priority: Priority = "medium"
    status: Status = "not_started"
    source: str = "会议讨论"
    evidence_time: str = "unknown"
    evidence_segment_ids: list[str] = Field(default_factory=list)

    @field_validator("owner", "deadline", "source", "evidence_time", mode="before")
    @classmethod
    def normalize_empty_string(cls, value):
        return normalize_unknown(value)


class RiskItem(BaseModel):
    risk: str
    impact: str = "unknown"
    suggested_followup: str = "unknown"
    owner: str = "unknown"
    severity: Severity = "medium"
    evidence_time: str = "unknown"
    evidence_segment_ids: list[str] = Field(default_factory=list)

    @field_validator(
        "impact",
        "suggested_followup",
        "owner",
        "evidence_time",
        mode="before",
    )
    @classmethod
    def normalize_empty_string(cls, value):
        return normalize_unknown(value)


class MeetingResult(BaseModel):
    meeting_overview: MeetingOverview
    summary: str = ""
    decisions: list[Decision] = Field(default_factory=list)
    action_items: list[ActionItem] = Field(default_factory=list)
    risks: list[RiskItem] = Field(default_factory=list)
    transcript_text: str = ""
    transcript_segments: list[dict] = Field(default_factory=list)