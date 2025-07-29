// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Lấy trạng thái ban đầu từ localStorage để duy trì đăng nhập
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      // Chú ý: Backend trả về token trong response.data.data
      const { token: apiToken, ...userData } = response.data.data;

      localStorage.setItem('token', apiToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(apiToken);
      setUser(userData);
      setIsAuthenticated(true);

    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Ném lỗi ra để component LoginPage có thể bắt và hiển thị thông báo
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = { user, token, isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để dễ dàng sử dụng context trong các component khác
export const useAuth = () => {
  return useContext(AuthContext);
};