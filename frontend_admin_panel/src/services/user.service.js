// src/services/user.service.js
import apiClient from './api';

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/users');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Không thể tải danh sách người dùng.');
    }
  },
};