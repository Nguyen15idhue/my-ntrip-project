// src/services/location.service.js
import apiClient from './api';

export const locationService = {
  // Hàm lấy tất cả các vị trí (dùng cho dropdown)
  getAllLocations: async () => {
    try {
      const response = await apiClient.get('/locations');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  },
};