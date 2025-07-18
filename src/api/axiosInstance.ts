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

// // 응답 인터셉터
// axiosInstance.interceptors.response.use(
//   // 2xx 범위의 상태 코드일 때의 응답은 그대로 반환
//   (response) => {
//     return response;
//   },
//   // 2xx 범위를 벗어나는 에러 처리
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

//     // 401 에러이고, 재시도한 요청이 아닐 경우에만 토큰 재발급 시도
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // 무한 재시도 방지를 위해 플래그 설정

//       try {
//         // 토큰 재발급 API 호출 (쿠키에 있는 refresh_token을 사용)
//         const { data } = await axiosInstance.post('api/v1/users/token/refresh');
        
//         // 새로운 access_token 저장
//         const newAccessToken = data.access_token;
//         localStorage.setItem('access_token', newAccessToken);
        
//         // 원래 요청의 헤더에 새로운 토큰 설정
//         if (originalRequest.headers) {
//             originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         }
        
//         // 원래 요청을 다시 시도
//         return axiosInstance(originalRequest);

//       } catch (refreshError) {
//         // 리프레시 토큰도 만료되었거나, 재발급 실패 시
//         console.error("토큰 재발급 실패:", refreshError);
//         // 저장된 토큰 삭제 및 로그인 페이지로 리디렉션
//         localStorage.removeItem('access_token');
//         window.location.href = '/login'; 
//         return Promise.reject(refreshError);
//       }
//     }
    
//     // 401 에러가 아니거나, 재시도 실패 시 에러를 그대로 반환
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
