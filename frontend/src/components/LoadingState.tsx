interface LoadingStateProps {
  mode: "text" | "audio";
}

export function LoadingState({ mode }: LoadingStateProps) {
  return (
    <div className="notice loading">
      <strong>正在分析会议内容</strong>
      <span>{mode === "audio" ? "音频分析可能耗时较长，请稍等。" : "正在调用后端生成会议纪要。"}</span>
    </div>
  );
}
