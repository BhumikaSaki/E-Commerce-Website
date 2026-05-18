import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('shopby_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const persistUser = (data) => {
    setUser(data);
    localStorage.setItem('shopby_user', JSON.stringify(data));
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persistUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    persistUser(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopby_user');
  };

  const refreshUser = useCallback(async () => {
    const stored = JSON.parse(localStorage.getItem('shopby_user') || '{}');
    if (!stored.token) return null;
    const { data } = await api.get('/auth/profile');
    persistUser({ ...data, token: stored.token });
    return data;
  }, []);

  const updateAvatar = (avatar, userData) => {
    const stored = JSON.parse(localStorage.getItem('shopby_user') || '{}');
    persistUser({ ...(userData || user), avatar, token: stored.token });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser, updateAvatar }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
