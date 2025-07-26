import { useQuery } from '@tanstack/react-query';
import { getUserImages } from '../api/users';

export const useUser = () => {
  const {
    data: userImages,
    isLoading: loading,
    error,
    refetch: refetchUserImages,
  } = useQuery({
    queryKey: ['userImages'],
    queryFn: async () => {
      try {
        const response = await getUserImages();
        console.log('API response:', response);
        // API 응답이 직접 배열로 오는 경우와 .data 프로퍼티가 있는 경우 모두 처리
        const data = Array.isArray(response) ? response : response.data;
        console.log('Processed data:', data);
        return data || [];
      } catch (err) {
        console.error('Failed to fetch user images:', err);
        // 에러 발생 시 빈 배열 반환하여 UI가 깨지지 않도록 함
        return [];
      }
    },
    retry: false, // 자동 재시도 비활성화
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
  });

  return {
    userImages: userImages || [],
    loading,
    error: error?.message || null,
    refetchUserImages,
  };
};