// src/services/location.service.js
import apiClient from './api';

export const locationService = {
  getAllLocations: async () => {
    try {
      const response = await apiClient.get('/locations');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw new Error('Không thể tải danh sách vị trí.');
    }
  },
};