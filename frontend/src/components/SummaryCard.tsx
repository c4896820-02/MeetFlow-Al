interface SummaryCardProps {
  summary: string;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <section className="panel">
      <h2>会议摘要</h2>
      <p className="summary-text">{summary || "暂无摘要。"}</p>
    </section>
  );
}
