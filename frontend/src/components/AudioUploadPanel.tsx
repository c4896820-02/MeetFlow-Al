interface AudioUploadPanelProps {
  file: File | null;
  isLoading: boolean;
  loadingMode: "text" | "audio" | null;
  onFileChange: (file: File | null) => void;
  onAnalyze: () => void;
}

export function AudioUploadPanel({
  file,
  isLoading,
  loadingMode,
  onFileChange,
  onAnalyze,
}: AudioUploadPanelProps) {
  return (
    <section className="panel input-card">
      <div className="panel-heading">
        <span className="panel-kicker">Audio meeting</span>
        <h3>音频会议</h3>
        <p>支持 mp3、wav、m4a、flac。音频分析可能耗时较长。</p>
      </div>
      <label className={`file-picker ${file ? "has-file" : ""}`}>
        <span className="file-picker-icon">↑</span>
        <span>
          <strong>{file ? "已选择文件" : "上传会议音频"}</strong>
          <small>{file ? file.name : "点击选择音频文件"}</small>
        </span>
        <input
          type="file"
          accept=".mp3,.wav,.m4a,.flac,audio/*"
          disabled={isLoading}
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />
      </label>
      <button className="primary-button full-width" disabled={isLoading || !file} onClick={onAnalyze}>
        {loadingMode === "audio" ? "分析中……" : "分析音频会议"}
      </button>
    </section>
  );
}
