import type { TranscriptSegment } from "../types/meeting";

interface TranscriptPanelProps {
  transcriptText: string;
  segments: TranscriptSegment[];
}

export function TranscriptPanel({ transcriptText, segments }: TranscriptPanelProps) {
  return (
    <section className="panel">
      <h2>原始转写文本</h2>
      {segments.length ? (
        <div className="segments">
          {segments.map((segment) => (
            <article key={segment.id} className="segment">
              <span>
                {segment.start} - {segment.end}
              </span>
              <p>{segment.text}</p>
            </article>
          ))}
        </div>
      ) : (
        <pre className="transcript-output">{transcriptText || "暂无原始转写文本。"}</pre>
      )}
    </section>
  );
}
