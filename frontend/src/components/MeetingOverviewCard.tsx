import type { MeetingOverview } from "../types/meeting";

interface MeetingOverviewCardProps {
  overview: MeetingOverview;
}

export function MeetingOverviewCard({ overview }: MeetingOverviewCardProps) {
  const participants = overview.participants || [];
  const topics = overview.main_topics || [];

  return (
    <section className="panel result-card">
      <div className="panel-heading compact">
        <h3>会议概览</h3>
      </div>
      <dl className="overview-grid">
        <div>
          <dt>标题</dt>
          <dd>{overview.meeting_title || "未知"}</dd>
        </div>
        <div>
          <dt>类型</dt>
          <dd>{overview.meeting_type || "未知"}</dd>
        </div>
        <div>
          <dt>日期</dt>
          <dd>{overview.meeting_date || "未知"}</dd>
        </div>
        <div>
          <dt>时长</dt>
          <dd>{overview.duration || "未知"}</dd>
        </div>
      </dl>
      <div className="meta-block">
        <span>参会人</span>
        <div className="tag-group">
          {participants.length ? participants.map((item) => <span key={item}>{item}</span>) : <span>未知</span>}
        </div>
      </div>
      <div className="meta-block">
        <span>主要议题</span>
        <div className="tag-group topics">
          {topics.length ? topics.map((item) => <span key={item}>{item}</span>) : <span>未知</span>}
        </div>
      </div>
    </section>
  );
}
