interface SummaryCardProps {
  summary: string;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <section className="panel result-card">
      <div className="panel-heading compact">
        <h3>会议摘要</h3>
      </div>
      <p className="summary-text">{summary || "暂无摘要。"}</p>
    </section>
  );
}
