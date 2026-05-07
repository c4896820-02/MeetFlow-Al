import type { AudioAnalyzeResponse, MeetingResult } from "../types/meeting";
import { ActionItemsTable } from "./ActionItemsTable";
import { DecisionsTable } from "./DecisionsTable";
import { ExportButtons } from "./ExportButtons";
import { MeetingOverviewCard } from "./MeetingOverviewCard";
import { RisksTable } from "./RisksTable";
import { SummaryCard } from "./SummaryCard";
import { TranscriptPanel } from "./TranscriptPanel";

interface ResultViewProps {
  result: MeetingResult | null;
  exportPayload: MeetingResult | AudioAnalyzeResponse | null;
  isLoading: boolean;
  onExport: (
    endpoint: "/export/json" | "/export/markdown" | "/export/excel",
    filename: string,
  ) => void;
}

export function ResultView({ result, exportPayload, isLoading, onExport }: ResultViewProps) {
  if (!result) {
    return (
      <section className="empty-state">
        <h2>等待分析结果</h2>
        <p>从左侧输入文本或上传音频后，会议纪要会显示在这里。</p>
      </section>
    );
  }

  return (
    <div className="result-stack">
      <ExportButtons disabled={isLoading} payload={exportPayload} onExport={onExport} />
      <MeetingOverviewCard overview={result.meeting_overview} />
      <SummaryCard summary={result.summary} />
      <DecisionsTable decisions={result.decisions || []} />
      <ActionItemsTable actionItems={result.action_items || []} />
      <RisksTable risks={result.risks || []} />
      <TranscriptPanel
        transcriptText={result.transcript_text}
        segments={result.transcript_segments || []}
      />
    </div>
  );
}
