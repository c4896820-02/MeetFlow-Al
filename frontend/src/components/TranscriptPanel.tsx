import type { TranscriptSegment } from "../types/meeting";

interface TranscriptPanelProps {
  transcriptText: string;
  segments: TranscriptSegment[];
}

export function TranscriptPanel({ transcriptText, segments }: TranscriptPanelProps) {
  const combinedText = segments.length
    ? segments
        .map((segment) => `[${segment.start} - ${segment.end}] ${segment.speaker || "Speaker"}: ${segment.text}`)
        .join("\n")
    : transcriptText;

  return (
    <section className="panel result-card">
      <div className="panel-heading compact">
        <h3>原始转写文本</h3>
      </div>
      <pre className="transcript-output">{combinedText || "暂无原始转写文本。"}</pre>
    </section>
  );
}
