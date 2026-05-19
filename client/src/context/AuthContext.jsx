import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((data) => {
    if (!data?.token) return;
    setUser(data);
    localStorage.setItem('shopby_user', JSON.stringify(data));
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    localStorage.removeItem('shopby_user');
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      const stored = localStorage.getItem('shopby_user');
      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        if (!parsed.token) {
          clearAuth();
          return;
        }
        setUser(parsed);
        const { data } = await api.get('/auth/profile');
        persistUser({ ...data, token: parsed.token });
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [clearAuth, persistUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });
    persistUser(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', {
      ...payload,
      email: payload.email.trim().toLowerCase(),
    });
    persistUser(data);
    return data;
  };

  const logout = () => clearAuth();

  const refreshUser = useCallback(async () => {
    const stored = JSON.parse(localStorage.getItem('shopby_user') || '{}');
    if (!stored.token) return null;
    const { data } = await api.get('/auth/profile');
    persistUser({ ...data, token: stored.token });
    return data;
  }, [persistUser]);

  const updateAvatar = (avatar, userData) => {
    const stored = JSON.parse(localStorage.getItem('shopby_user') || '{}');
    persistUser({ ...(userData || user), avatar, token: stored.token });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        updateAvatar,
        isAuthenticated: Boolean(user?.token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
