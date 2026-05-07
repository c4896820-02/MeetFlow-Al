import type {
  AudioAnalyzeResponse,
  BackendErrorPayload,
  HealthResponse,
  MeetingResult,
} from "../types/meeting";

const API_BASE_URL = "/api";

async function parseError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as BackendErrorPayload;
    return payload.detail?.message || `请求失败，状态码 ${response.status}`;
  } catch {
    return `请求失败，状态码 ${response.status}`;
  }
}

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<T>;
}

export function checkHealth(): Promise<HealthResponse> {
  return requestJson<HealthResponse>("/health");
}

export function analyzeText(transcript: string): Promise<MeetingResult> {
  return requestJson<MeetingResult>("/analyze/text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transcript }),
  });
}

export function analyzeAudio(file: File): Promise<AudioAnalyzeResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return requestJson<AudioAnalyzeResponse>("/analyze/audio", {
    method: "POST",
    body: formData,
  });
}

export async function exportMeetingFile(
  endpoint: "/export/json" | "/export/markdown" | "/export/excel",
  payload: MeetingResult | AudioAnalyzeResponse,
  filename: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}
