import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Download, Trash2, Loader2 } from "lucide-react";
import { useFittingVideos } from "@/hooks/useFittings";

const VirtualFittingVideos = memo(() => {
  const { data: fittingVideos, isLoading, error } = useFittingVideos();

  const handlePlayVideo = (videoUrl: string, productName: string) => {
    // 실제로는 비디오 플레이어 모달을 열어야 함
    console.log("재생할 영상:", productName, videoUrl);
    // 임시로 새 탭에서 영상 열기
    window.open(videoUrl, "_blank");
  };

  const handleDownloadVideo = (videoUrl: string, productName: string) => {
    // 실제로는 서버에서 영상 다운로드 링크 제공
    console.log("다운로드할 영상:", productName, videoUrl);
    // 임시로 alert 표시
    alert(`"${productName}" 가상피팅 영상 다운로드를 시작합니다.`);

    // 다운로드 링크 생성 (임시)
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `${productName}_fitting_video.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteVideo = (productId: number, productName: string) => {
    if (confirm(`"${productName}" 가상피팅 영상을 삭제하시겠습니까?`)) {
      // 실제로는 서버에 삭제 요청을 보내야 함
      console.log("삭제할 영상:", productId, productName);
      alert("영상 삭제 기능은 아직 구현되지 않았습니다.");
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <Card className="mb-10">
        <CardHeader>
          <CardTitle className="text-lg">가상피팅 영상</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">가상피팅 영상을 불러오는 중...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Card className="mb-10">
        <CardHeader>
          <CardTitle className="text-lg">가상피팅 영상</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            <p className="mb-4">가상피팅 영상을 불러오는데 실패했습니다.</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              다시 시도
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 영상이 없는 상태
  if (!fittingVideos || fittingVideos.length === 0) {
    return (
      <Card className="mb-10">
        <CardHeader>
          <CardTitle className="text-lg">가상피팅 영상</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">아직 완성된 가상피팅 영상이 없습니다.</p>
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
            {fittingVideos.map((video) => (
              <div key={video.product_id} className="flex-shrink-0">
                {/* 썸네일 영역 - Detail.tsx 메인 이미지와 같은 비율 (532:800 = 2:3) */}
                <div className="relative w-32 h-48 bg-gray-100 rounded-lg overflow-hidden group cursor-pointer mb-3">
                  {/* 영상 썸네일 (실제로는 영상에서 추출하거나 별도 API로 제공) */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>

                  {/* 호버시 나타나는 플레이 버튼 */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30">
                    <button
                      onClick={() =>
                        handlePlayVideo(video.video_url, video.product_name)
                      }
                      className="bg-white bg-opacity-90 hover:bg-white text-black rounded-full p-3 transition-all duration-200 hover:scale-110"
                    >
                      <Play className="w-6 h-6 fill-current" />
                    </button>
                  </div>
                </div>

                {/* 영상 정보 */}
                <div className="w-32">
                  <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                    {video.product_name}
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">가상피팅 완료</p>

                  {/* 액션 버튼들 */}
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownloadVideo(video.video_url, video.product_name)
                      }
                      className="h-7 w-7 p-0 flex-shrink-0"
                      title="다운로드"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDeleteVideo(video.product_id, video.product_name)
                      }
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

        {fittingVideos.length > 4 && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" className="w-full">
              모든 영상 보기 ({fittingVideos.length}개)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

VirtualFittingVideos.displayName = "VirtualFittingVideos";

export default VirtualFittingVideos;
