from fastapi import HTTPException


class AppErrorCode:
    EMPTY_TRANSCRIPT = "EMPTY_TRANSCRIPT"
    TEXT_TOO_SHORT = "TEXT_TOO_SHORT"
    INVALID_AUDIO_FORMAT = "INVALID_AUDIO_FORMAT"
    AUDIO_FILE_TOO_LARGE = "AUDIO_FILE_TOO_LARGE"
    ASR_FAILED = "ASR_FAILED"
    LLM_ANALYSIS_FAILED = "LLM_ANALYSIS_FAILED"
    EXPORT_FAILED = "EXPORT_FAILED"
    VALIDATION_FAILED = "VALIDATION_FAILED"
    UNKNOWN_ERROR = "UNKNOWN_ERROR"


def raise_app_error(
    status_code: int,
    error_code: str,
    message: str,
    detail: str | None = None,
):
    """
    抛出统一格式的业务异常。
    """
    raise HTTPException(
        status_code=status_code,
        detail={
            "error_code": error_code,
            "message": message,
            "detail": detail,
        },
    )