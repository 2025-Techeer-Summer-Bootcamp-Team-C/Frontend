import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUserImage, getUserImages } from '../api/users';

export const useUser = () => {
  const queryClient = useQueryClient();

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

  // 이미지 삭제 뮤테이션
  const deleteImageMutation = useMutation({
    mutationFn: deleteUserImage,
    onSuccess: () => {
      // 삭제 성공 시 사용자 이미지 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['userImages'] });
    },
    onError: (error) => {
      console.error('Failed to delete user image:', error);
    },
  });

  return {
    userImages: userImages || [],
    loading,
    error: error?.message || null,
    refetchUserImages,
    deleteImage: deleteImageMutation.mutate,
    isDeleting: deleteImageMutation.isPending,
    deleteError: deleteImageMutation.error,
  };
};

