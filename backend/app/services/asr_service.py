from pathlib import Path
from typing import Any

from faster_whisper import WhisperModel


class ASRService:
    """
    音频转写服务。

    V1 策略：
    1. 使用 faster-whisper 做本地 ASR；
    2. 暂不做真实说话人识别；
    3. speaker 统一标记为 unknown；
    4. 输出 transcript segments。
    """

    def __init__(
        self,
        model_size: str = "tiny",
        device: str = "cpu",
        compute_type: str = "int8",
    ):
        self.model_size = model_size
        self.device = device
        self.compute_type = compute_type

        print(f"Loading Whisper model: {model_size}, device={device}, compute_type={compute_type}")

        self.model = WhisperModel(
            model_size,
            device=device,
            compute_type=compute_type,
        )

        print("Whisper model loaded.")

    def transcribe(self, audio_path: Path) -> list[dict[str, Any]]:
        """
        将音频文件转写为 transcript segments。
        """
        if not audio_path.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        segments, info = self.model.transcribe(
            str(audio_path),
            language="zh",
            vad_filter=True,
        )

        transcript_segments = []

        for index, segment in enumerate(segments, start=1):
            text = segment.text.strip()

            if not text:
                continue

            transcript_segments.append(
                {
                    "id": f"seg_{index:03d}",
                    "start": self._format_time(segment.start),
                    "end": self._format_time(segment.end),
                    "speaker": "unknown",
                    "text": text,
                    "confidence": None,
                }
            )

        return transcript_segments

    def segments_to_text(self, segments: list[dict[str, Any]]) -> str:
        """
        将 transcript segments 转成适合现有 LLM 分析链路的文本格式。
        """
        lines = []

        for item in segments:
            start = item.get("start", "unknown")
            end = item.get("end", "unknown")
            speaker = item.get("speaker", "unknown")
            text = item.get("text", "")

            if not text:
                continue

            lines.append(f"[{start}-{end}] {speaker}：{text}")

        return "\n\n".join(lines)

    @staticmethod
    def _format_time(seconds: float) -> str:
        """
        将秒数转为 HH:MM:SS 格式。
        """
        total_seconds = int(seconds)
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        secs = total_seconds % 60

        return f"{hours:02d}:{minutes:02d}:{secs:02d}"