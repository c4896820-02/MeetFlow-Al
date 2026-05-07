export type Priority = "high" | "medium" | "low";
export type Status = "not_started" | "in_progress" | "done" | "unknown";
export type Confidence = "high" | "medium" | "low";
export type Severity = "high" | "medium" | "low";

export interface MeetingOverview {
  meeting_title: string;
  meeting_type: string;
  meeting_date: string;
  duration: string;
  participants: string[];
  main_topics: string[];
}

export interface Decision {
  decision: string;
  owner: string;
  evidence_time: string;
  evidence_segment_ids: string[];
  confidence: Confidence;
}

export interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
  priority: Priority;
  status: Status;
  source: string;
  evidence_time: string;
  evidence_segment_ids: string[];
}

export interface RiskItem {
  risk: string;
  impact: string;
  suggested_followup: string;
  owner: string;
  severity: Severity;
  evidence_time: string;
  evidence_segment_ids: string[];
}

export interface TranscriptSegment {
  id: string;
  start: string;
  end: string;
  speaker: string;
  text: string;
  confidence: number | null;
}

export interface MeetingResult {
  meeting_overview: MeetingOverview;
  summary: string;
  decisions: Decision[];
  action_items: ActionItem[];
  risks: RiskItem[];
  transcript_text: string;
  transcript_segments: TranscriptSegment[];
}

export interface AudioAnalyzeResponse {
  filename: string;
  saved_path: string;
  transcript_segments: TranscriptSegment[];
  transcript_text: string;
  meeting_result: MeetingResult;
}

export interface HealthResponse {
  status: string;
  message: string;
}

export interface BackendErrorPayload {
  detail?: {
    error_code?: string;
    message?: string;
    detail?: string;
  };
}
