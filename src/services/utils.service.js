// src/services/utils.service.js
import apiClient from './api';

const handleError = (error, defaultMessage = 'Có lỗi xảy ra.') => {
  console.error(defaultMessage, error);
  const message = error.response?.data?.message || defaultMessage;
  throw new Error(message);
};

export const utilsService = {
  fetchMountpoints: async (host, port) => {
    // API yêu cầu host và port là query params
    const params = { host, port };
    try {
      const response = await apiClient.get('/utils/fetch-mountpoints', { params });
      return response.data.data; // Trả về mảng các mountpoint objects
    } catch (error) {
      return handleError(error, 'Không thể lấy danh sách mountpoint.');
    }
  },
};