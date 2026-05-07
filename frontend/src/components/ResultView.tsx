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
      <div className="result-stack">
        <div className="result-toolbar">
          <div className="section-heading">
            <span>Output</span>
            <h2>会议结果</h2>
          </div>
        </div>
        <section className="empty-state">
          <div className="empty-state-icon">MF</div>
          <h3>等待分析结果</h3>
          <p>
            从左侧粘贴会议文本或上传音频后，会议摘要、TODO 清单和风险问题会显示在这里。
          </p>
          <ul>
            <li>自动生成会议摘要</li>
            <li>提取责任人与截止时间</li>
            <li>支持 Markdown / Excel 导出</li>
          </ul>
        </section>
      </div>
    );
  }

  return (
    <div className="result-stack">
      <div className="result-toolbar">
        <div className="section-heading">
          <span>Output</span>
          <h2>会议结果</h2>
        </div>
        <ExportButtons disabled={isLoading} payload={exportPayload} onExport={onExport} />
      </div>
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
