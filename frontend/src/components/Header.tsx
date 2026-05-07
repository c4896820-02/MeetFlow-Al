interface HeaderProps {
  backendStatus: "checking" | "online" | "offline";
}

export function Header({ backendStatus }: HeaderProps) {
  const statusText = {
    checking: "检查中",
    online: "后端已连接",
    offline: "后端未连接",
  }[backendStatus];

  return (
    <header className="app-header">
      <div className="brand-block">
        <h1>MeetFlow AI</h1>
        <p>AI 会议助手 Demo</p>
      </div>
      <span className={`status-pill ${backendStatus}`}>
        <span aria-hidden="true" />
        {statusText}
      </span>
    </header>
  );
}
