interface TextInputPanelProps {
  transcript: string;
  isLoading: boolean;
  onTranscriptChange: (value: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
}

export function TextInputPanel({
  transcript,
  isLoading,
  onTranscriptChange,
  onAnalyze,
  onClear,
}: TextInputPanelProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>文本会议</h2>
        <p>粘贴会议转写文本后生成结构化纪要。</p>
      </div>
      <textarea
        className="transcript-input"
        value={transcript}
        placeholder="例如：[00:00:01-00:00:10] Speaker 1：今天同步项目进展..."
        onChange={(event) => onTranscriptChange(event.target.value)}
      />
      <div className="button-row">
        <button disabled={isLoading || !transcript.trim()} onClick={onAnalyze}>
          分析文本会议
        </button>
        <button className="secondary" disabled={isLoading} onClick={onClear}>
          清空
        </button>
      </div>
    </section>
  );
}
