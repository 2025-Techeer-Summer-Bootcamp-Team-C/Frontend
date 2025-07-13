import axios from "axios";

const axiosInstance = axios.create({
  // 백엔드 drf 서버 주소
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
