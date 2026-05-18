import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user?.isAdmin) return undefined;

    const socket = io('/', { path: '/socket.io', transports: ['websocket', 'polling'] });

    socket.on('connect', () => {
      socket.emit('joinAdmin');
    });

    socket.on('newOrder', (payload) => {
      setNotifications((prev) => [
        { id: Date.now(), type: 'order', message: `New order from ${payload.user} — $${payload.totalPrice?.toFixed(2)}`, ...payload },
        ...prev,
      ]);
    });

    socket.on('stockUpdate', (payload) => {
      setNotifications((prev) => [
        {
          id: Date.now() + 1,
          type: 'stock',
          message: `Stock update: ${payload.name} — ${payload.countInStock} left`,
          ...payload,
        },
        ...prev.slice(0, 9),
      ]);
    });

    return () => socket.disconnect();
  }, [user?.isAdmin]);

  const dismiss = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <SocketContext.Provider value={{ notifications, dismiss }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
