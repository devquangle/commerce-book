import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAuthToken, setAuthToken, getToken, removeAuthToken, removeToken } from "../utils/cookie";
import { TokenType } from "../constant/token.type";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// 1. Axios instance cho các request public (không yêu cầu đăng nhập)
export const publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Axios instance cho các request yêu cầu xác thực (cần token)
export const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Tự động gắn token vào header của mỗi request
authAxios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Array để lưu các request bị lỗi khi đang trong quá trình refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor: Xử lý lỗi trả về chung (VD: Token hết hạn)
authAxios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Nếu API trả về lỗi 401 Unauthorized và request này chưa từng được retry
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, đưa các request khác vào hàng đợi
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
               originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return authAxios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getToken(TokenType.REFRESH_TOKEN);
      
      if (!refreshToken) {
        // Không có refresh token -> Đăng xuất luôn
        removeAuthToken();
        isRefreshing = false;
        // window.location.href = "/login"; // Bật dòng này nếu muốn tự động đá ra trang login
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh token (dùng dynamic import để tránh Circular Dependency vì auth.service import axios)
        const { AuthService } = await import("@/modules/auth/services/auth.service");
        const loginResponse = await AuthService.refreshToken({ refreshToken });

        // Lấy accessToken từ response
        const { accessToken } = loginResponse; 
        
        // Lưu token mới vào cookie
        setAuthToken(accessToken);

        // Chạy lại các request đang nằm trong hàng đợi
        processQueue(null, accessToken);
        
        // Cập nhật token cho request hiện tại và chạy lại
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return authAxios(originalRequest);
      } catch (_error) {
        // Nếu refresh token cũng thất bại (VD: refresh token hết hạn)
        processQueue(_error, null);
        removeAuthToken();
        removeToken(TokenType.REFRESH_TOKEN);
        // window.location.href = "/login"; // Bật dòng này nếu muốn tự động đá ra trang login
        return Promise.reject(_error);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);
