// src/services/station.service.js
import apiClient from './api';

const handleError = (error, defaultMessage = 'Có lỗi xảy ra.') => {
  console.error(defaultMessage, error);
  const message = error.response?.data?.message || defaultMessage;
  throw new Error(message);
};

export const stationService = {
  getAllStations: async (params = {}) => {
    try {
      const response = await apiClient.get('/stations', { params });
      return response.data.data;
    } catch (error) {
      return handleError(error, 'Không thể tải danh sách trạm.');
    }
  },

  createStation: async (stationData) => {
    try {
      const response = await apiClient.post('/stations', stationData);
      return response.data;
    } catch (error) {
      return handleError(error, 'Tạo trạm mới thất bại.');
    }
  },

  updateStation: async (id, stationData) => {
    try {
      const response = await apiClient.put(`/stations/${id}`, stationData);
      return response.data;
    } catch (error) {
      return handleError(error, `Cập nhật trạm #${id} thất bại.`);
    }
  },

  deleteStation: async (id) => {
    try {
      const response = await apiClient.delete(`/stations/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error, `Xóa trạm #${id} thất bại.`);
    }
  },

  startStation: async (id) => {
    try {
      const response = await apiClient.post(`/stations/${id}/start`);
      return response.data;
    } catch (error) {
      return handleError(error, `Khởi động trạm #${id} thất bại.`);
    }
  },

  stopStation: async (id) => {
    try {
      const response = await apiClient.post(`/stations/${id}/stop`);
      return response.data;
    } catch (error) {
      return handleError(error, `Dừng trạm #${id} thất bại.`);
    }
  },
  
  bulkAction: async (action, stationIds) => {
    try {
      const response = await apiClient.post('/stations/bulk-action', { action, stationIds });
      return response.data;
    } catch (error) {
      return handleError(error, `Thực hiện hành động hàng loạt '${action}' thất bại.`);
    }
  },

  // ======================= THÊM HÀM MỚI =======================
  getStationStats: async (id) => {
    try {
        const response = await apiClient.get(`/stations/${id}/stats`);
        // Trả về data bên trong, chứa { connected: boolean, ... }
        return response.data.data; 
    } catch (error) {
        // Không ném lỗi ra ngoài để không làm crash luồng chính
        console.error(`Không thể lấy stats cho trạm #${id}`, error);
        return { connected: false, error: true }; // Trả về trạng thái mặc định khi lỗi
    }
  }
  // =============================================================
};