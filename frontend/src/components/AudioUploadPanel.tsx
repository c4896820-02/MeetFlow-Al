interface AudioUploadPanelProps {
  file: File | null;
  isLoading: boolean;
  onFileChange: (file: File | null) => void;
  onAnalyze: () => void;
}

export function AudioUploadPanel({
  file,
  isLoading,
  onFileChange,
  onAnalyze,
}: AudioUploadPanelProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>音频会议</h2>
        <p>支持 mp3、wav、m4a、flac。音频分析可能耗时较长。</p>
      </div>
      <label className="file-picker">
        <span>{file ? file.name : "选择音频文件"}</span>
        <input
          type="file"
          accept=".mp3,.wav,.m4a,.flac,audio/*"
          disabled={isLoading}
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />
      </label>
      <button disabled={isLoading || !file} onClick={onAnalyze}>
        分析音频会议
      </button>
    </section>
  );
}
