// src/services/auth.service.js
import apiClient from './api';

const handleError = (error, defaultMessage = 'Có lỗi xảy ra.') => {
  console.error(defaultMessage, error);
  const message = error.response?.data?.message || defaultMessage;
  throw new Error(message);
};

export const authService = {
  register: async (userData) => {
    try {
      // API của bạn yêu cầu name, email, password
      const { name, email, password } = userData;
      const response = await apiClient.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error) {
      return handleError(error, 'Tạo người dùng mới thất bại.');
    }
  },
};