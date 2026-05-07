import { useEffect, useState } from "react";
import {
  analyzeAudio,
  analyzeText,
  checkHealth,
  exportMeetingFile,
} from "./api/meetflowApi";
import { AudioUploadPanel } from "./components/AudioUploadPanel";
import { ErrorMessage } from "./components/ErrorMessage";
import { Header } from "./components/Header";
import { LoadingState } from "./components/LoadingState";
import { ResultView } from "./components/ResultView";
import { TextInputPanel } from "./components/TextInputPanel";
import type { AudioAnalyzeResponse, MeetingResult } from "./types/meeting";

type LoadingMode = "text" | "audio" | null;

function App() {
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">(
    "checking",
  );
  const [transcript, setTranscript] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [exportPayload, setExportPayload] = useState<MeetingResult | AudioAnalyzeResponse | null>(
    null,
  );
  const [loadingMode, setLoadingMode] = useState<LoadingMode>(null);
  const [error, setError] = useState("");

  const isLoading = loadingMode !== null;

  useEffect(() => {
    checkHealth()
      .then(() => setBackendStatus("online"))
      .catch(() => setBackendStatus("offline"));
  }, []);

  async function handleAnalyzeText() {
    setError("");
    setLoadingMode("text");

    try {
      const response = await analyzeText(transcript);
      setResult(response);
      setExportPayload(response);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "请求失败，请稍后重试。");
    } finally {
      setLoadingMode(null);
    }
  }

  async function handleAnalyzeAudio() {
    if (!audioFile) {
      return;
    }

    setError("");
    setLoadingMode("audio");

    try {
      const response = await analyzeAudio(audioFile);
      setResult(response.meeting_result);
      setExportPayload(response);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "请求失败，请稍后重试。");
    } finally {
      setLoadingMode(null);
    }
  }

  async function handleExport(
    endpoint: "/export/json" | "/export/markdown" | "/export/excel",
    filename: string,
  ) {
    if (!exportPayload) {
      return;
    }

    setError("");

    try {
      await exportMeetingFile(endpoint, exportPayload, filename);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "导出失败，请稍后重试。");
    }
  }

  function handleClear() {
    setTranscript("");
    setAudioFile(null);
    setResult(null);
    setExportPayload(null);
    setError("");
  }

  return (
    <div className="app-shell">
      <Header backendStatus={backendStatus} />
      <main className="main-layout">
        <div className="input-stack">
          <TextInputPanel
            transcript={transcript}
            isLoading={isLoading}
            onTranscriptChange={setTranscript}
            onAnalyze={handleAnalyzeText}
            onClear={handleClear}
          />
          <AudioUploadPanel
            file={audioFile}
            isLoading={isLoading}
            onFileChange={setAudioFile}
            onAnalyze={handleAnalyzeAudio}
          />
          {loadingMode && <LoadingState mode={loadingMode} />}
          {error && <ErrorMessage message={error} />}
        </div>
        <ResultView
          result={result}
          exportPayload={exportPayload}
          isLoading={isLoading}
          onExport={handleExport}
        />
      </main>
    </div>
  );
}

export default App;
