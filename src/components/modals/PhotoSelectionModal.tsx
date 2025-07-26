import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@/hooks/useUser";
import { X } from "lucide-react";

interface PhotoSelectionModalProps {
  onClose: () => void;
  onPhotoSelect: ((selectedPhoto: File | string | number) => void) | null;
}

export default function PhotoSelectionModal({
  onClose,
  onPhotoSelect,
}: PhotoSelectionModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedHistoryImageId, setSelectedHistoryImageId] = useState<number | null>(null);
  const { userImages, loading, error, deleteImage, isDeleting } = useUser();

  console.log(
    "PhotoSelectionModal - userImages:",
    userImages,
    "loading:",
    loading,
    "error:",
    error
  );

  const handleFileUpload = (files: File[]) => {
    setSelectedFile(files[0] || null);
    setSelectedHistoryImageId(null); // 새 파일 선택 시 히스토리 선택 해제
  };

  const handleHistoryPhotoSelect = (userImageId: number) => {
    setSelectedHistoryImageId(userImageId);
    setSelectedFile(null); // 히스토리 사진 선택 시 새 파일 선택 해제
  };

  const handleStartFitting = () => {
    const selectedPhoto = selectedFile || selectedHistoryImageId;
    if (selectedPhoto && onPhotoSelect) {
      onPhotoSelect(selectedPhoto);
    }
    onClose();
  };

  const handleDeleteImage = (e: React.MouseEvent, imageId: number) => {
    e.stopPropagation(); // 이미지 선택 이벤트 방지
    if (window.confirm("정말 이 사진을 삭제하시겠습니까?")) {
      deleteImage(imageId);
      // 삭제하려는 이미지가 현재 선택된 이미지라면 선택 해제
      if (selectedHistoryImageId === imageId) {
        setSelectedHistoryImageId(null);
      }
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>전신사진 선택</DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* 파일 업로드 섹션 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            새 사진 업로드
          </h3>
          <FileUpload onChange={handleFileUpload} disabled={false} />
        </div>

        {/* 사진 히스토리 섹션 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            사진 히스토리
          </h3>
          {loading ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">사진을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-red-500">사진을 불러오는데 실패했습니다.</p>
              <p className="text-sm text-gray-400 mt-2">{error}</p>
            </div>
          ) : userImages.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">아직 업로드한 사진이 없습니다.</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {userImages.map((image) => (
                <div
                  key={image.id}
                  className={`relative aspect-[10/16] w-35 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedHistoryImageId === image.id
                      ? "border-black ring-2 ring-black ring-offset-2"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleHistoryPhotoSelect(image.id)}
                >
                  <img
                    src={image.image}
                    alt="사용자 사진"
                    className="w-full h-full object-cover"
                  />
                  {/* 삭제 버튼 */}
                  <button
                    onClick={(e) => handleDeleteImage(e, image.id)}
                    disabled={isDeleting}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    title="사진 삭제"
                  >
                    <X size={16} />
                  </button>
                  {image.is_fitting && (
                    <div className="absolute top-10 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      피팅완료
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleStartFitting}
            disabled={!selectedFile && !selectedHistoryImageId}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            피팅 시작하기
          </button>
        </div>
      </div>
    </>
  );
}
