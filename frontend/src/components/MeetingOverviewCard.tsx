import type { MeetingOverview } from "../types/meeting";

interface MeetingOverviewCardProps {
  overview: MeetingOverview;
}

export function MeetingOverviewCard({ overview }: MeetingOverviewCardProps) {
  return (
    <section className="panel">
      <h2>会议概览</h2>
      <dl className="overview-grid">
        <div>
          <dt>标题</dt>
          <dd>{overview.meeting_title || "unknown"}</dd>
        </div>
        <div>
          <dt>类型</dt>
          <dd>{overview.meeting_type || "unknown"}</dd>
        </div>
        <div>
          <dt>日期</dt>
          <dd>{overview.meeting_date || "unknown"}</dd>
        </div>
        <div>
          <dt>时长</dt>
          <dd>{overview.duration || "unknown"}</dd>
        </div>
      </dl>
      <div className="tag-group">
        {(overview.participants || []).map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="tag-group topics">
        {(overview.main_topics || []).map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}
