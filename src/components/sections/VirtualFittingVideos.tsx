import { useState, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Download, Trash2 } from "lucide-react";

// Mock 가상피팅 영상 데이터
const mockVirtualFittingVideos = [
  {
    id: "1",
    productName: "클래식 데님 재킷",
    videoUrl: "/api/videos/fitting-1.mp4", // 실제로는 서버에서 제공되는 URL
    thumbnailUrl: "/api/thumbnails/fitting-1.jpg",
    createdAt: "2024-01-15T10:30:00Z",
    duration: 45, // 초 단위
    size: "M",
    color: "인디고 블루",
  },
  {
    id: "2",
    productName: "오버사이즈 후드티",
    videoUrl: "/api/videos/fitting-2.mp4",
    thumbnailUrl: "/api/thumbnails/fitting-2.jpg",
    createdAt: "2024-01-12T14:20:00Z",
    duration: 38,
    size: "L",
    color: "차콜 그레이",
  },
  {
    id: "3",
    productName: "슬림핏 정장 바지",
    videoUrl: "/api/videos/fitting-3.mp4",
    thumbnailUrl: "/api/thumbnails/fitting-3.jpg",
    createdAt: "2024-01-10T09:15:00Z",
    duration: 52,
    size: "32",
    color: "네이비",
  },
  {
    id: "4",
    productName: "코튼 블렌드 셔츠",
    videoUrl: "/api/videos/fitting-4.mp4",
    thumbnailUrl: "/api/thumbnails/fitting-4.jpg",
    createdAt: "2024-01-08T16:45:00Z",
    duration: 41,
    size: "L",
    color: "화이트",
  },
];

const VirtualFittingVideos = memo(() => {
  const [videos, setVideos] = useState(mockVirtualFittingVideos);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePlayVideo = (videoId: string) => {
    // 실제로는 비디오 플레이어 모달을 열어야 함
    console.log("재생할 영상:", videoId);
  };

  const handleDownloadVideo = (videoId: string) => {
    const video = videos.find((v) => v.id === videoId);
    if (video) {
      // 실제로는 서버에서 영상 다운로드 링크 제공
      console.log("다운로드할 영상:", video.productName);
      // 임시로 alert 표시
      alert(`"${video.productName}" 가상피팅 영상 다운로드를 시작합니다.`);
    }
  };

  const handleDeleteVideo = (videoId: string) => {
    const video = videos.find((v) => v.id === videoId);
    if (
      video &&
      confirm(`"${video.productName}" 가상피팅 영상을 삭제하시겠습니까?`)
    ) {
      setVideos((prevVideos) => prevVideos.filter((v) => v.id !== videoId));
      // 실제로는 서버에 삭제 요청
    }
  };

  if (videos.length === 0) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">가상피팅 영상</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">아직 가상피팅을 진행한 상품이 없습니다.</p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-black text-white hover:bg-gray-800"
            >
              상품 둘러보기
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-10">
      <CardHeader>
        <CardTitle className="text-lg">가상피팅 영상</CardTitle>
        <p className="text-sm text-gray-600">
          AI 가상피팅으로 생성된 영상들을 확인하고 관리할 수 있습니다.
        </p>
      </CardHeader>
      <CardContent>
        {/* 가로 스크롤 컨테이너 */}
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-2" style={{ minWidth: "max-content" }}>
            {videos.map((video) => (
              <div key={video.id} className="flex-shrink-0">
                {/* 썸네일 영역 - Detail.tsx 메인 이미지와 같은 비율 (532:800 = 2:3) */}
                <div className="relative w-32 h-48 bg-gray-100 rounded-lg overflow-hidden group cursor-pointer mb-3">
                  {/* 실제로는 video.thumbnailUrl 사용 */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    {/* 기본 상품 이미지 역할 */}
                    <div className="w-full h-full bg-gray-300"></div>
                  </div>

                  {/* 호버시 나타나는 플레이 버튼 */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30">
                    <button
                      onClick={() => handlePlayVideo(video.id)}
                      className="bg-white bg-opacity-90 hover:bg-white text-black rounded-full p-3 transition-all duration-200 hover:scale-110"
                    >
                      <Play className="w-6 h-6 fill-current" />
                    </button>
                  </div>
                </div>

                {/* 영상 정보 */}
                <div className="w-32">
                  <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                    {video.productName}
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">
                    {formatDate(video.createdAt)}
                  </p>

                  {/* 액션 버튼들 */}
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadVideo(video.id)}
                      className="h-7 w-7 p-0 flex-shrink-0"
                      title="다운로드"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteVideo(video.id)}
                      className="h-7 w-7 p-0 text-red-600 hover:text-red-700 flex-shrink-0"
                      title="삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {videos.length > 4 && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" className="w-full">
              모든 영상 보기 ({videos.length}개)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

VirtualFittingVideos.displayName = "VirtualFittingVideos";

export default VirtualFittingVideos;
