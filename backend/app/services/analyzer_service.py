from pathlib import Path
from typing import Any

from app.services.llm_service import LLMService
from app.services.validation_service import ValidationService


BASE_DIR = Path(__file__).resolve().parents[2]
PROMPT_DIR = BASE_DIR / "app" / "prompts"


class AnalyzerService:
    """
    会议分析服务。

    负责：
    1. 读取 Prompt 模板；
    2. 调用 LLM；
    3. 分别生成会议概览、关键决策、TODO、风险；
    4. 合并为 meeting_result；
    5. 通过 ValidationService 做 Pydantic 校验。
    """

    def __init__(self):
        self.llm = LLMService()
        self.validator = ValidationService()

    def _load_prompt(self, filename: str) -> str:
        prompt_path = PROMPT_DIR / filename

        if not prompt_path.exists():
            raise FileNotFoundError(f"Prompt file not found: {prompt_path}")

        return prompt_path.read_text(encoding="utf-8")

    def _build_prompt(self, template_name: str, transcript: str) -> str:
        template = self._load_prompt(template_name)
        return template.replace("{{transcript}}", transcript)

    def _parse_json(self, raw_text: str) -> Any:
        return self.validator.parse_json(raw_text)

    def analyze_overview_summary(self, transcript: str) -> dict:
        prompt = self._build_prompt("overview_summary.txt", transcript)
        raw_result = self.llm.chat(prompt)
        return self._parse_json(raw_result)

    def extract_decisions(self, transcript: str) -> list:
        prompt = self._build_prompt("extract_decisions.txt", transcript)
        raw_result = self.llm.chat(prompt)
        return self._parse_json(raw_result)

    def extract_action_items(self, transcript: str) -> list:
        prompt = self._build_prompt("extract_action_items.txt", transcript)
        raw_result = self.llm.chat(prompt)
        return self._parse_json(raw_result)

    def extract_risks(self, transcript: str) -> list:
        prompt = self._build_prompt("extract_risks.txt", transcript)
        raw_result = self.llm.chat(prompt)
        return self._parse_json(raw_result)

    def analyze_meeting(self, transcript: str) -> dict:
        overview_summary = self.analyze_overview_summary(transcript)
        decisions = self.extract_decisions(transcript)
        action_items = self.extract_action_items(transcript)
        risks = self.extract_risks(transcript)

        raw_result = {
            "meeting_overview": overview_summary.get("meeting_overview", {}),
            "summary": overview_summary.get("summary", ""),
            "decisions": decisions,
            "action_items": action_items,
            "risks": risks,
        }

        validated_result = self.validator.validate_meeting_result(raw_result)

        return self.validator.to_dict(validated_result)