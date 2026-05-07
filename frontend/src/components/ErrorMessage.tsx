interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="notice error">
      <strong>请求失败</strong>
      <span>{message}</span>
    </div>
  );
}
