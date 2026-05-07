interface TextInputPanelProps {
  transcript: string;
  isLoading: boolean;
  loadingMode: "text" | "audio" | null;
  onTranscriptChange: (value: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
}

export function TextInputPanel({
  transcript,
  isLoading,
  loadingMode,
  onTranscriptChange,
  onAnalyze,
  onClear,
}: TextInputPanelProps) {
  return (
    <section className="panel input-card">
      <div className="panel-heading">
        <span className="panel-kicker">Text meeting</span>
        <h3>文本会议</h3>
        <p>粘贴会议转写文本，快速生成结构化纪要。</p>
      </div>
      <textarea
        className="transcript-input"
        value={transcript}
        placeholder={`例如：
[00:00:03] 王欣：今天先确认新版支付流程的上线计划，目标是下周三灰度。
[00:01:20] 李明：风控规则还需要补一轮回归测试，我负责周五前给出结果。
[00:03:05] 陈晨：客服 FAQ 需要同步更新，否则上线后咨询量会增加。`}
        onChange={(event) => onTranscriptChange(event.target.value)}
      />
      <div className="button-row">
        <button className="primary-button" disabled={isLoading || !transcript.trim()} onClick={onAnalyze}>
          {loadingMode === "text" ? "分析中……" : "分析文本会议"}
        </button>
        <button className="secondary-button" disabled={isLoading} onClick={onClear}>
          清空
        </button>
      </div>
    </section>
  );
}
