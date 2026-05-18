import { useSocket } from '../context/SocketContext.jsx';

function NotificationToast() {
  const { notifications, dismiss } = useSocket();

  if (!notifications.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex max-w-sm flex-col gap-2">
      {notifications.slice(0, 5).map((n) => (
        <div
          key={n.id}
          className={`card flex items-start justify-between gap-2 border-l-4 p-3 shadow-lg ${
            n.type === 'order' ? 'border-l-brand-600' : 'border-l-amber-500'
          }`}
        >
          <p className="text-sm">{n.message}</p>
          <button type="button" onClick={() => dismiss(n.id)} className="text-stone-400 hover:text-stone-700">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default NotificationToast;
