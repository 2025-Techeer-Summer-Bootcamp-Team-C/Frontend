import { useState, useRef, memo } from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProfileImageProps {
  currentImage?: string;
  userName?: string;
  onImageChange?: (imageUrl: string | null) => void;
  size?: "sm" | "md" | "lg";
  variant?: "circle" | "fullBody";
}

const ProfileImage = memo(
  ({
    currentImage,
    userName = "사용자",
    onImageChange,
    size = "md",
  }: ProfileImageProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(
      currentImage || null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sizeClasses = {
      sm: "w-20", // 전신 사진용 세로 직사각형
      md: "w-24", // 전신 사진용 세로 직사각형
      lg: "w-32", // 전신 사진용 세로 직사각형
    };

    const processAndPreviewImage = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };

        reader.onerror = () => {
          reject(new Error("파일 읽기에 실패했습니다."));
        };

        reader.readAsDataURL(file);
      });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // 파일 타입 검증
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
        alert("JPG, PNG, GIF, WebP 이미지 파일만 업로드 가능합니다.");
        return;
      }

      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert("5MB 이하의 이미지만 업로드 가능합니다.");
        return;
      }

      try {
        setIsUploading(true);

        // 이미지 미리보기 생성
        const imageUrl = await processAndPreviewImage(file);
        setPreviewImage(imageUrl);

        // 실제 프로젝트에서는 여기서 서버에 업로드하고 URL을 받아옴
        // 현재는 mock으로 처리
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 부모 컴포넌트에 변경사항 알림
        onImageChange?.(imageUrl);
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsUploading(false);
        // 파일 입력 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    const handleRemoveImage = async () => {
      if (!confirm("프로필 이미지를 삭제하시겠습니까?")) return;

      try {
        setPreviewImage(null);
        onImageChange?.(null);
      } catch (error) {
        console.error("이미지 삭제 실패:", error);
        alert("이미지 삭제에 실패했습니다.");
      }
    };

    const handleUploadClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div className="flex flex-col items-center space-y-4">
        <div
          className={`${sizeClasses[size]} border-2 border-gray-200 rounded-lg overflow-hidden`}
        >
          <AspectRatio ratio={2 / 3}>
            {previewImage ? (
              <img
                src={previewImage}
                alt={`${userName}의 프로필 이미지`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                <User className="w-8 h-8 mb-2" />
                <span className="text-xs text-center px-2">전신 사진</span>
              </div>
            )}
          </AspectRatio>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? "업로드 중..." : "이미지 변경"}
          </Button>

          {previewImage && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              삭제
            </Button>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          className="hidden"
          aria-label="프로필 이미지 업로드"
        />

        {size !== "sm" && (
          <p className="text-xs text-gray-500 text-center max-w-xs">
            사진 변경은 한 번만 가능합니다.
          </p>
        )}
      </div>
    );
  }
);

ProfileImage.displayName = "ProfileImage";

export default ProfileImage;
