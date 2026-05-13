import { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart]       = useState([]);

  /* ── Restore session ── */
  useEffect(() => {
    const saved = localStorage.getItem('eg_user');
    if (saved) setUser(JSON.parse(saved));
    const savedCart = localStorage.getItem('eg_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    setLoading(false);
  }, []);

  /* ── Persist cart ── */
  useEffect(() => {
    localStorage.setItem('eg_cart', JSON.stringify(cart));
  }, [cart]);

  /* ── AUTH ── */
  const register = async (userData) => {
    try {
      await userAPI.register(userData);
      return { success: true, message: 'Registration successful! Please login.' };
    } catch (err) {
      return { success: false, message: err.response?.data || 'Registration failed' };
    }
  };

  const login = async (username, password) => {
    try {
      /* Admin hardcoded login */
      if (username.toLowerCase() === 'admin' && password === 'admin123') {
        const adminUser = { id: 'admin', username: 'admin', name: 'Administrator', role: 'ADMIN', isAdmin: true };
        setUser(adminUser);
        localStorage.setItem('eg_user', JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      }

      /* User login */
      const res = await userAPI.login({ username, password });
      if (res.data.success) {
        const userData = { ...res.data.user, isAdmin: res.data.user.role === 'ADMIN' };
        // Never store password
        delete userData.password;
        setUser(userData);
        localStorage.setItem('eg_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: 'Login failed' };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Invalid credentials' };
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('eg_user');
    localStorage.removeItem('eg_cart');
  };

  const updateProfile = async (id, updatedData) => {
    try {
      const res = await userAPI.update(id, updatedData);
      const userData = { ...res.data, isAdmin: res.data.role === 'ADMIN' };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('eg_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: err.response?.data || 'Profile update failed' };
    }
  };

  /* ── CART ── */
  const addToCart = (product, options = {}, quantity = 1) => {
    const cartKey = `${product.id}|${options.color || 'default'}|${options.size || 'default'}|${options.weight || 'default'}`;
    setCart(prev => {
      const existing = prev.find(i => i.cartKey === cartKey);
      if (existing) {
        return prev.map(i => i.cartKey === cartKey ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        ...product,
        price: product.offerPrice || product.price,
        cartKey,
        color: options.color || '',
        size: options.size || '',
        weight: options.weight || '',
        quantity,
      }];
    });
  };

  const removeFromCart = (cartKey) => {
    setCart(prev => prev.filter(i => i.cartKey !== cartKey));
  };

  const updateCartQty = (cartKey, quantity) => {
    if (quantity < 1) { removeFromCart(cartKey); return; }
    setCart(prev => prev.map(i => i.cartKey === cartKey ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const cartCount   = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal   = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <AuthContext.Provider value={{
      user, login, logout, register, loading, updateProfile,
      cart, addToCart, removeFromCart, updateCartQty, clearCart,
      cartCount, cartTotal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);