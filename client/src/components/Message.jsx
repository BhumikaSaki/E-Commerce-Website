function Message({ variant = 'error', children }) {
  const styles =
    variant === 'success'
      ? 'border-green-200 bg-green-50 text-green-800'
      : 'border-red-200 bg-red-50 text-red-700';
  return <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${styles}`}>{children}</div>;
}

export default Message;
