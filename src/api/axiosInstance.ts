import axios, { type InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  // 백엔드 drf 서버 주소
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 전송을 위해 필요
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 인증이 필요 없는 엔드포인트들
    const publicEndpoints = ['api/v1/users/signup', 'api/v1/users/login'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    // public 엔드포인트가 아닌 경우에만 Authorization 헤더 추가
    if (!isPublicEndpoint) {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
