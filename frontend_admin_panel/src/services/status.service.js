// src/services/status.service.js
import apiClient from './api';

const handleError = (error, defaultMessage = 'Có lỗi xảy ra.') => {
  console.error(defaultMessage, error);
  // Xử lý riêng cho lỗi không có quyền (admin-only)
  if (error.response?.status === 403) {
      throw new Error("Bạn không có quyền truy cập chức năng này.");
  }
  const message = error.response?.data?.message || defaultMessage;
  throw new Error(message);
};

export const statusService = {
  getOnlineConnections: async () => {
    try {
      const response = await apiClient.get('/status/connections');
      return response.data.data; // Trả về mảng các kết nối
    } catch (error) {
      return handleError(error, 'Không thể tải danh sách rover đang online.');
    }
  },
};