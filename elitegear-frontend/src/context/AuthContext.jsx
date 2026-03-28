import { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      await userAPI.register(userData);
      return { success: true, message: "Registration successful! Please login." };
    } catch (error) {
      const msg = error.response?.data || "Registration failed";
      return { success: false, message: msg };
    }
  };

  const login = async (username, password) => {
    try {
      // Special Admin Login
      if (username.toLowerCase() === 'admin' && password === 'admin123') {
        const adminUser = { 
          username: 'admin', 
          role: 'ADMIN', 
          isAdmin: true, 
          name: 'Administrator' 
        };
        setUser(adminUser);
        localStorage.setItem('current_user', JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      }

      // Real Backend Login for normal users
      const response = await userAPI.login({ username, password });
      
      if (response.data.success) {
        const userData = {
          ...response.data.user,
          isAdmin: response.data.user.role === 'ADMIN'
        };
        
        setUser(userData);
        localStorage.setItem('current_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      
      return { success: false, message: "Login failed" };
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid username or password";
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);