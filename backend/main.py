import shutil
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from app.services.asr_service import ASRService
from app.services.analyzer_service import AnalyzerService
from app.services.export_service import ExportService
from app.services.validation_service import ValidationService
from app.services.error_service import AppErrorCode, raise_app_error


BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "outputs"
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_AUDIO_SIZE_MB = 200
MAX_AUDIO_SIZE_BYTES = MAX_AUDIO_SIZE_MB * 1024 * 1024

app = FastAPI(
    title="MeetFlow AI Backend",
    description="AI会议助手后端服务：支持会议文本分析、结构化纪要生成和文件导出。",
    version="1.0.0",
)

asr_service = ASRService()

class TextAnalyzeRequest(BaseModel):
    transcript: str = Field(..., description="会议转写文本")

def is_allowed_audio_file(filename: str) -> bool:
    allowed_suffixes = {".mp3", ".wav", ".m4a", ".flac"}
    suffix = Path(filename).suffix.lower()
    return suffix in allowed_suffixes


def save_uploaded_file(file: UploadFile) -> Path:
    if not file.filename:
        raise_app_error(
            status_code=400,
            error_code=AppErrorCode.INVALID_AUDIO_FORMAT,
            message="上传文件缺少文件名，请重新选择文件。",
            detail="Uploaded file has no filename.",
        )

    if not is_allowed_audio_file(file.filename):
        raise_app_error(
            status_code=400,
            error_code=AppErrorCode.INVALID_AUDIO_FORMAT,
            message="音频格式不支持，请上传 mp3、wav、m4a 或 flac 文件。",
            detail=f"Unsupported filename: {file.filename}",
        )

    suffix = Path(file.filename).suffix.lower()
    safe_filename = f"{uuid4().hex}{suffix}"
    file_path = UPLOAD_DIR / safe_filename

    total_size = 0

    with file_path.open("wb") as buffer:
        while True:
            chunk = file.file.read(1024 * 1024)

            if not chunk:
                break

            total_size += len(chunk)

            if total_size > MAX_AUDIO_SIZE_BYTES:
                buffer.close()
                file_path.unlink(missing_ok=True)
                raise_app_error(
                    status_code=400,
                    error_code=AppErrorCode.AUDIO_FILE_TOO_LARGE,
                    message=f"音频文件过大，请上传不超过 {MAX_AUDIO_SIZE_MB}MB 的文件。",
                    detail=f"Audio file exceeds {MAX_AUDIO_SIZE_MB}MB.",
                )

            buffer.write(chunk)

    return file_path

def extract_meeting_result(payload: dict[str, Any]) -> dict[str, Any]:
    """
    兼容两种导出输入格式：

    1. 直接传 MeetingResult：
       {
         "meeting_overview": {},
         "summary": "",
         "decisions": [],
         "action_items": [],
         "risks": []
       }

    2. 传 /analyze/audio 的完整返回：
       {
         "filename": "...",
         "transcript_text": "...",
         "meeting_result": {
           ...
         }
       }
    """
    if "meeting_result" in payload and isinstance(payload["meeting_result"], dict):
        return payload["meeting_result"]

    return payload


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "MeetFlow AI backend is running.",
    }


@app.get("/api-info")
def api_info():
    """
    返回当前后端 API 能力清单，方便前端开发和联调。
    """
    return {
        "name": "MeetFlow AI Backend",
        "version": "1.0.0",
        "description": "AI会议助手后端服务，支持文本/音频会议分析、结构化纪要生成、结果校验与文件导出。",
        "base_url": "http://127.0.0.1:8000",
        "endpoints": [
            {
                "method": "GET",
                "path": "/health",
                "description": "服务健康检查",
            },
            {
                "method": "GET",
                "path": "/api-info",
                "description": "查看后端接口能力清单",
            },
            {
                "method": "POST",
                "path": "/analyze/text",
                "description": "输入会议转写文本，返回结构化会议分析结果",
                "request_type": "application/json",
                "request_example": {
                    "transcript": "[00:00:01-00:00:10] Speaker 1：我们今天同步一下项目进展。"
                },
                "response_fields": [
                    "meeting_overview",
                    "summary",
                    "decisions",
                    "action_items",
                    "risks",
                    "transcript_text",
                    "transcript_segments",
                ],
            },
            {
                "method": "POST",
                "path": "/upload/audio",
                "description": "上传音频文件，仅完成 ASR 转写，不做会议分析",
                "request_type": "multipart/form-data",
                "file_field": "file",
                "supported_formats": ["mp3", "wav", "m4a", "flac"],
                "response_fields": [
                    "filename",
                    "saved_path",
                    "transcript_segments",
                    "transcript_text",
                ],
            },
            {
                "method": "POST",
                "path": "/analyze/audio",
                "description": "上传音频文件，完成 ASR 转写和会议结构化分析",
                "request_type": "multipart/form-data",
                "file_field": "file",
                "supported_formats": ["mp3", "wav", "m4a", "flac"],
                "response_fields": [
                    "filename",
                    "saved_path",
                    "transcript_segments",
                    "transcript_text",
                    "meeting_result",
                ],
            },
            {
                "method": "POST",
                "path": "/validate/meeting-result",
                "description": "对用户编辑后的会议分析结果进行二次结构校验",
                "request_type": "application/json",
                "input": "MeetingResult 或包含 meeting_result 字段的对象",
                "response_fields": [
                    "valid",
                    "meeting_result",
                ],
            },
            {
                "method": "POST",
                "path": "/export/json",
                "description": "导出会议分析结果为 JSON 文件",
                "request_type": "application/json",
                "input": "MeetingResult 或包含 meeting_result 字段的对象",
                "response_type": "file",
            },
            {
                "method": "POST",
                "path": "/export/markdown",
                "description": "导出会议分析结果为 Markdown 会议纪要",
                "request_type": "application/json",
                "input": "MeetingResult 或包含 meeting_result 字段的对象",
                "response_type": "file",
            },
            {
                "method": "POST",
                "path": "/export/excel",
                "description": "导出会议分析结果为 Excel 文件",
                "request_type": "application/json",
                "input": "MeetingResult 或包含 meeting_result 字段的对象",
                "response_type": "file",
            },
            {
                "method": "POST",
                "path": "/export/meeting-record",
                "description": "将完整会议记录导出到独立目录，包含 JSON、Markdown、Excel 和 transcript.txt",
                "request_type": "application/json",
                "input": "MeetingResult 或包含 meeting_result 字段的对象",
                "response_fields": [
                    "message",
                    "meeting_dir",
                    "files",
                ],
            },
        ],
        "meeting_result_schema": {
            "meeting_overview": {
                "meeting_title": "string",
                "meeting_type": "string",
                "meeting_date": "string",
                "duration": "string",
                "participants": "string[]",
                "main_topics": "string[]",
            },
            "summary": "string",
            "decisions": [
                {
                    "decision": "string",
                    "owner": "string",
                    "evidence_time": "string",
                    "evidence_segment_ids": "string[]",
                    "confidence": "high | medium | low",
                }
            ],
            "action_items": [
                {
                    "task": "string",
                    "owner": "string",
                    "deadline": "string",
                    "priority": "high | medium | low",
                    "status": "not_started | in_progress | done | unknown",
                    "source": "string",
                    "evidence_time": "string",
                    "evidence_segment_ids": "string[]",
                }
            ],
            "risks": [
                {
                    "risk": "string",
                    "impact": "string",
                    "suggested_followup": "string",
                    "owner": "string",
                    "severity": "high | medium | low",
                    "evidence_time": "string",
                    "evidence_segment_ids": "string[]",
                }
            ],
            "transcript_text": "string",
            "transcript_segments": [
                {
                    "id": "string",
                    "start": "string",
                    "end": "string",
                    "speaker": "string",
                    "text": "string",
                    "confidence": "number | null",
                }
            ],
        },
        "error_format": {
            "detail": {
                "error_code": "string",
                "message": "string",
                "detail": "string",
            }
        },
    }


@app.post("/analyze/text")
def analyze_text(request: TextAnalyzeRequest):
    """
    输入会议文本，返回结构化会议分析结果。
    同时保留 transcript_text，方便导出和原文追溯。
    """
    try:
        transcript = request.transcript.strip()

        if len(transcript) < 30:
            raise_app_error(
                status_code=400,
                error_code=AppErrorCode.TEXT_TOO_SHORT,
                message="会议文本过短，无法生成有效会议纪要。",
                detail="Transcript length is less than 30 characters.",
            )

        analyzer = AnalyzerService()
        result = analyzer.analyze_meeting(transcript)

        result["transcript_text"] = transcript
        result["transcript_segments"] = []

        return result

    except HTTPException:
        raise

    except Exception as error:
        raise_app_error(
            status_code=500,
            error_code=AppErrorCode.LLM_ANALYSIS_FAILED,
            message="会议文本分析失败，请稍后重试或检查模型配置。",
            detail=str(error),
        )
    
    
@app.post("/upload/audio")
def upload_audio(file: UploadFile = File(...)):
    """
    上传会议音频并转写为 transcript segments。
    只做 ASR，不做会议分析。
    """
    try:
        audio_path = save_uploaded_file(file)

        transcript_segments = asr_service.transcribe(audio_path)
        transcript_text = asr_service.segments_to_text(transcript_segments)

        if not transcript_text.strip():
            raise_app_error(
                status_code=422,
                error_code=AppErrorCode.EMPTY_TRANSCRIPT,
                message="未识别到有效会议内容，请检查音频质量、音量或文件内容。",
                detail="ASR transcription is empty.",
            )

        return {
            "filename": file.filename,
            "saved_path": str(audio_path),
            "transcript_segments": transcript_segments,
            "transcript_text": transcript_text,
        }

    except HTTPException:
        raise

    except Exception as error:
        raise_app_error(
            status_code=500,
            error_code=AppErrorCode.ASR_FAILED,
            message="音频转写失败，请检查文件是否损坏，或稍后重试。",
            detail=str(error),
        )


@app.post("/analyze/audio")
def analyze_audio(file: UploadFile = File(...)):
    """
    上传会议音频，完成：
    1. 保存文件
    2. ASR 转写
    3. LLM 结构化分析
    4. 返回会议分析结果
    """
    try:
        audio_path = save_uploaded_file(file)

        transcript_segments = asr_service.transcribe(audio_path)
        transcript_text = asr_service.segments_to_text(transcript_segments)

        if not transcript_text.strip():
            raise_app_error(
                status_code=422,
                error_code=AppErrorCode.EMPTY_TRANSCRIPT,
                message="未识别到有效会议内容，请检查音频质量、音量或文件内容。",
                detail="ASR transcription is empty.",
            )

        analyzer = AnalyzerService()
        meeting_result = analyzer.analyze_meeting(transcript_text)

        meeting_result["transcript_text"] = transcript_text
        meeting_result["transcript_segments"] = transcript_segments

        return {
            "filename": file.filename,
            "saved_path": str(audio_path),
            "transcript_segments": transcript_segments,
            "transcript_text": transcript_text,
            "meeting_result": meeting_result,
        }

    except HTTPException:
        raise

    except Exception as error:
        raise_app_error(
            status_code=500,
            error_code=AppErrorCode.LLM_ANALYSIS_FAILED,
            message="音频分析失败。音频已上传，但转写或会议分析过程出现异常。",
            detail=str(error),
        )


@app.post("/validate/meeting-result")
def validate_meeting_result(payload: dict[str, Any]):
    """
    对用户编辑后的 meeting_result 进行二次校验。
    """
    try:
        meeting_result = extract_meeting_result(payload)

        validator = ValidationService()
        cleaned_result = validator.validate_and_clean(meeting_result)

        return {
            "valid": True,
            "meeting_result": cleaned_result,
        }
    
    except HTTPException:
        raise

    except Exception as error:
        raise_app_error(
            status_code=422,
            error_code=AppErrorCode.VALIDATION_FAILED,
            message="会议结果结构校验失败，请检查字段是否完整、枚举值是否合法。",
            detail=str(error),
        )


@app.post("/export/json")
def export_json(payload: dict[str, Any]):
    """
    将会议分析结果导出为 JSON 文件。
    支持直接传 MeetingResult，也支持传 /analyze/audio 的完整返回。
    """
    try:
        meeting_result = extract_meeting_result(payload)

        exporter = ExportService(output_dir=OUTPUT_DIR)
        path = exporter.export_json(meeting_result)

        return FileResponse(
            path=path,
            filename="meeting_result.json",
            media_type="application/json",
        )

    except HTTPException:
        raise

    except Exception as error:
        raise_app_error(
            status_code=500,
            error_code=AppErrorCode.EXPORT_FAILED,
            message="JSON 文件导出失败，请检查会议结果结构。",
            detail=str(error),
        )


@app.post("/export/markdown")
def export_markdown(payload: dict[str, Any]):
    """
    将会议分析结果导出为 Markdown 文件。
    支持直接传 MeetingResult，也支持传 /analyze/audio 的完整返回。
    """
    try:
        meeting_result = extract_meeting_result(payload)

        exporter = ExportService(output_dir=OUTPUT_DIR)
        path = exporter.export_markdown(meeting_result)

        return FileResponse(
            path=path,
            filename="meeting_minutes.md",
            media_type="text/markdown",
        )

    except HTTPException:
        raise

    except Exception as error:
        raise_app_error(
            status_code=500,
            error_code=AppErrorCode.EXPORT_FAILED,
            message="Markdown 文件导出失败，请检查会议结果结构。",
            detail=str(error),
        )


@app.post("/export/excel")
def export_excel(payload: dict[str, Any]):
    """
    将会议分析结果导出为 Excel 文件。
    支持直接传 MeetingResult，也支持传 /analyze/audio 的完整返回。
    """
    try:
        meeting_result = extract_meeting_result(payload)

        exporter = ExportService(output_dir=OUTPUT_DIR)
        path = exporter.export_excel(meeting_result)

        return FileResponse(
            path=path,
            filename="meeting_result.xlsx",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )

    except HTTPException:
        raise

    except Exception as error:
        raise_app_error(
            status_code=500,
            error_code=AppErrorCode.EXPORT_FAILED,
            message="Excel 文件导出失败，请检查会议结果结构。",
            detail=str(error),
        )
    

@app.post("/export/meeting-record")
def export_meeting_record(payload: dict[str, Any]):
    """
    导出完整会议记录到独立目录，避免覆盖历史文件。
    支持直接传 MeetingResult，也支持传 /analyze/audio 的完整返回。
    """
    try:
        meeting_result = extract_meeting_result(payload)

        exporter = ExportService(output_dir=OUTPUT_DIR)
        paths = exporter.export_meeting_record(meeting_result)

        return {
            "message": "完整会议记录导出成功。",
            "meeting_dir": str(paths["meeting_dir"]),
            "files": {
                "json": str(paths["json"]),
                "markdown": str(paths["markdown"]),
                "excel": str(paths["excel"]),
                "transcript": str(paths["transcript"]),
            },
        }

    except HTTPException:
        raise

    except Exception as error:
        raise_app_error(
            status_code=500,
            error_code=AppErrorCode.EXPORT_FAILED,
            message="完整会议记录导出失败，请检查会议结果结构。",
            detail=str(error),
        )
