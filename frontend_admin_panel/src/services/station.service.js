// src/services/station.service.js
import apiClient from './api';

export const stationService = {
  // Hàm lấy tất cả các trạm
  getAllStations: async () => {
    try {
      const response = await apiClient.get('/stations');
      return response.data.data; // Trả về mảng stations
    } catch (error) {
      console.error('Error fetching stations:', error);
      throw error; // Ném lỗi để component có thể xử lý
    }
  },

  // (Trong tương lai, bạn sẽ thêm các hàm khác ở đây)
  // createStation: async (stationData) => { ... },
  // updateStation: async (id, stationData) => { ... },
};