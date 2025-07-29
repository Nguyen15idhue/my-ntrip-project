// src/services/rover.service.js
import apiClient from './api';

const handleError = (error, defaultMessage = 'Có lỗi xảy ra.') => {
  console.error(defaultMessage, error);
  const message = error.response?.data?.message || defaultMessage;
  throw new Error(message);
};

export const roverService = {
  getAllRovers: async () => {
    try {
      const response = await apiClient.get('/rovers');
      return response.data.data;
    } catch (error) {
      return handleError(error, 'Không thể tải danh sách rover.');
    }
  },

  createRover: async (roverData) => {
    try {
      const response = await apiClient.post('/rovers', roverData);
      return response.data;
    } catch (error) {
      return handleError(error, 'Tạo rover mới thất bại.');
    }
  },

  updateRover: async (id, roverData) => {
    try {
      const response = await apiClient.put(`/rovers/${id}`, roverData);
      return response.data;
    } catch (error) {
      return handleError(error, `Cập nhật rover #${id} thất bại.`);
    }
  },

  deleteRover: async (id) => {
    try {
      const response = await apiClient.delete(`/rovers/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error, `Xóa rover #${id} thất bại.`);
    }
  },

  bulkAction: async (action, roverIds) => {
    try {
      const response = await apiClient.post('/rovers/bulk-action', { action, roverIds });
      return response.data;
    } catch (error) {
      return handleError(error, `Thực hiện hành động hàng loạt '${action}' thất bại.`);
    }
  },
};