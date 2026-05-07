type BadgeTone = "high" | "medium" | "low" | "neutral" | "done" | "progress";

const priorityLabels: Record<string, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

const statusLabels: Record<string, string> = {
  not_started: "未开始",
  in_progress: "进行中",
  done: "已完成",
  unknown: "未知",
};

const statusTones: Record<string, BadgeTone> = {
  not_started: "neutral",
  in_progress: "progress",
  done: "done",
  unknown: "neutral",
};

interface ValueBadgeProps {
  type: "priority" | "status" | "confidence" | "severity";
  value?: string;
}

export function ValueBadge({ type, value }: ValueBadgeProps) {
  const normalizedValue = value || "unknown";
  const label = type === "status" ? statusLabels[normalizedValue] : priorityLabels[normalizedValue];
  const tone = type === "status" ? statusTones[normalizedValue] : normalizedValue;

  return <span className={`value-badge ${tone || "neutral"}`}>{label || normalizedValue}</span>;
}
