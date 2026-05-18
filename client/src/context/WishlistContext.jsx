import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/users/wishlist');
      setWishlist(data);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) =>
    wishlist.some((p) => p._id === productId || p === productId);

  const toggleWishlist = async (productId) => {
    if (!user) throw new Error('LOGIN_REQUIRED');
    if (isInWishlist(productId)) {
      const { data } = await api.delete(`/users/wishlist/${productId}`);
      setWishlist(data);
    } else {
      const { data } = await api.post(`/users/wishlist/${productId}`);
      setWishlist(data);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, fetchWishlist, isInWishlist, toggleWishlist, count: wishlist.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
