import { create } from 'zustand';

/**
 * Zustand Auth Store: Quản lý trạng thái đăng nhập người dùng trên toàn ứng dụng Client
 * Nạp dữ liệu khởi tạo từ LocalStorage khi F5 lại trang để giữ phiên đăng nhập.
 */
export const useAuthStore = create((set) => ({
  // 1. Dữ liệu trạng thái ban đầu (State)
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isLoggedIn: !!localStorage.getItem('accessToken'),

  /**
   * 2. Action: Lưu thông tin khi Đăng nhập / Refresh Token thành công
   */
  setAuth: ({ user, accessToken, refreshToken }) => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    
    set((state) => ({
      user: user || state.user,
      accessToken: accessToken || state.accessToken,
      refreshToken: refreshToken || state.refreshToken,
      isLoggedIn: true
    }));
  },

  /**
   * 3. Action: Xóa thông tin khi Đăng xuất (Logout)
   */
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false
    });
  }
}));
