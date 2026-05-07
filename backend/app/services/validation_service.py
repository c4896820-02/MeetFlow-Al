import json
from typing import Any

from pydantic import ValidationError

from app.schemas.meeting_schema import MeetingResult


class ValidationService:
    @staticmethod
    def clean_json_text(raw_text: str) -> str:
        """
        清理模型输出中可能出现的 Markdown 包裹。
        """
        cleaned = raw_text.strip()

        if cleaned.startswith("```json"):
            cleaned = cleaned.removeprefix("```json").strip()

        if cleaned.startswith("```"):
            cleaned = cleaned.removeprefix("```").strip()

        if cleaned.endswith("```"):
            cleaned = cleaned.removesuffix("```").strip()

        return cleaned

    @staticmethod
    def parse_json(raw_text: str) -> Any:
        """
        将模型输出解析为 Python 对象。
        """
        cleaned = ValidationService.clean_json_text(raw_text)
        return json.loads(cleaned)

    @staticmethod
    def validate_meeting_result(data: dict) -> MeetingResult:
        """
        将 dict 校验为 MeetingResult。
        """
        try:
            return MeetingResult.model_validate(data)
        except ValidationError as error:
            print("\n===== Pydantic 校验失败 =====\n")
            print(error)
            raise

    @staticmethod
    def to_dict(meeting_result: MeetingResult) -> dict:
        """
        将 Pydantic 对象转回 dict，方便保存 JSON 或返回 API。
        """
        return meeting_result.model_dump()
    
    @staticmethod
    def validate_and_clean(data: dict) -> dict:
        """
        对用户编辑后的 meeting_result 进行二次校验，并返回干净 dict。
        """
        validated_result = ValidationService.validate_meeting_result(data)
        return ValidationService.to_dict(validated_result)