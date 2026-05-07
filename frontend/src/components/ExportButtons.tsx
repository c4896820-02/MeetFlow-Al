import type { AudioAnalyzeResponse, MeetingResult } from "../types/meeting";

interface ExportButtonsProps {
  disabled: boolean;
  onExport: (
    endpoint: "/export/json" | "/export/markdown" | "/export/excel",
    filename: string,
  ) => void;
  payload: MeetingResult | AudioAnalyzeResponse | null;
}

export function ExportButtons({ disabled, onExport, payload }: ExportButtonsProps) {
  if (!payload) {
    return null;
  }

  return (
    <div className="export-row">
      <button
        className="secondary-button"
        disabled={disabled}
        onClick={() => onExport("/export/json", "meeting_result.json")}
      >
        导出 JSON
      </button>
      <button
        className="secondary-button"
        disabled={disabled}
        onClick={() => onExport("/export/markdown", "meeting_minutes.md")}
      >
        导出 Markdown
      </button>
      <button
        className="primary-button excel-button"
        disabled={disabled}
        onClick={() => onExport("/export/excel", "meeting_result.xlsx")}
      >
        导出 Excel
      </button>
    </div>
  );
}
