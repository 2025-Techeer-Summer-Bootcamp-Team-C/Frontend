import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PhotoSelectionModalProps {
  onClose: () => void;
  onPhotoSelect: ((selectedPhoto: File | string) => void) | null;
}

export default function PhotoSelectionModal({
  onClose,
  onPhotoSelect,
}: PhotoSelectionModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (files: File[]) => {
    setSelectedFile(files[0] || null);
  };

  const handleStartFitting = () => {
    if (selectedFile && onPhotoSelect) {
      onPhotoSelect(selectedFile);
    }
    onClose();
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
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              이전에 업로드한 사진들이 여기에 표시됩니다.
            </p>
            <p className="text-sm text-gray-400 mt-2">API 연동 후 구현 예정</p>
          </div>
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
            disabled={!selectedFile}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            피팅 시작하기
          </button>
        </div>
      </div>
    </>
  );
}
