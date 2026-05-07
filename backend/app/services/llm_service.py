from openai import OpenAI

from app.config import settings


class LLMService:
    def __init__(self):
        if not settings.LLM_API_KEY:
            raise ValueError("LLM_API_KEY is missing. Please check your .env file.")

        if not settings.LLM_BASE_URL:
            raise ValueError("LLM_BASE_URL is missing. Please check your .env file.")

        if not settings.LLM_MODEL:
            raise ValueError("LLM_MODEL is missing. Please check your .env file.")

        self.client = OpenAI(
            api_key=settings.LLM_API_KEY,
            base_url=settings.LLM_BASE_URL,
        )

        self.model = settings.LLM_MODEL

    def chat(self, prompt: str) -> str:
        """
        调用大模型，并返回模型输出文本。
        V1 阶段先用最简单的 chat completion。
        """
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "你是一个严谨的 AI 会议助手，擅长从会议文本中提取摘要、决策、TODO 和风险。",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.2,
        )

        return response.choices[0].message.content