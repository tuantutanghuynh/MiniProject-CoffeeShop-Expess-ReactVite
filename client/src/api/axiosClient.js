import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Khởi tạo Axios Instance chuẩn cho toàn bộ ứng dụng Client
 * BaseURL trỏ tới nhóm REST API Backend Node.js
 */
const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 1. REQUEST INTERCEPTOR
 * Tự động đính kèm Access Token vào Header 'Authorization: Bearer <token>' trước mỗi request
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Khai báo biến cờ và mảng hàng chờ cho cơ chế Refresh Token Rotation đồng thời
let isRefreshing = false;
let failedQueue = [];

// Hàm xử lý hàng chờ các request bị nghẽn trong lúc đang xin token mới
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * 2. RESPONSE INTERCEPTOR (AXIOS AUTO REFRESH 401 RETRY QUEUE)
 * Tự động ngắt lỗi 401 TOKEN_EXPIRED ➔ Gọi Refresh Token ➔ Retry request ban đầu ngầm
 */
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Các endpoint xác thực (login/register/refresh) tự trả 401 khi sai thông tin
    // đăng nhập hoặc refresh token hết hạn — KHÔNG phải trường hợp access token
    // hết hạn, nên phải bỏ qua cơ chế refresh/redirect bên dưới, để lỗi được trả
    // thẳng về cho component gọi (vd: LoginPage) hiển thị thông báo lỗi thực tế.
    const isAuthEndpoint = ['/auth/login', '/auth/register', '/auth/refresh'].some((url) =>
      originalRequest.url?.includes(url)
    );

    // Nếu gặp lỗi 401 Unauthorized và request này chưa từng retry
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      
      // Nếu đã có một request khác đang trong quá trình Refresh Token
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      // Nếu không có Refresh Token trong LocalStorage ➔ Ép logout ngay
      if (!refreshToken) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // BẮT BỘC DÙNG THƯ VIỆN AXIOS GỐC (Tránh lặp vô tận Interceptor)
        const res = await axios.post('http://localhost:3000/api/v1/auth/refresh', {
          refreshToken
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.data;

        // Cập nhật Cặp Token mới vào Zustand Store & LocalStorage
        useAuthStore.getState().setAuth({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        });

        axiosClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Giải phóng tất cả các request đang chờ trong Queue
        processQueue(null, newAccessToken);
        isRefreshing = false;

        // TỰ ĐỘNG RETRY GỬI LẠI REQUEST BAN ĐẦU
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;

        // Nếu Refresh Token bị từ chối/hết hạn/đánh cắp ➔ Đăng xuất lập tức
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
