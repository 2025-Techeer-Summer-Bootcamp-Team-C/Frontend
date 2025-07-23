import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/contexts/ModalContext";
import ProfileImage from "@/components/common/ProfileImage";
import VirtualFittingVideos from "@/components/sections/VirtualFittingVideos";
import { useAuth } from "@/contexts/AuthContext";

// // Mock user data - 실제로는 auth context에서 가져올 데이터
// const mockUser = {
//   name: "홍길동",
//   username: "hong_gildong",
//   email: "user@example.com",
//   phone: "010-1234-5678",
//   profileImage: null as string | null, // 프로필 이미지 URL
//   addresses: [
//     {
//       id: "1",
//       name: "집",
//       recipient: "홍길동",
//       full: "서울시 강남구 테헤란로 123",
//       zipcode: "06142",
//       phone: "010-1234-5678",
//       isDefault: true,
//     },
//     {
//       id: "2",
//       name: "회사",
//       recipient: "홍길동",
//       full: "서울시 서초구 강남대로 456",
//       zipcode: "06543",
//       phone: "010-1234-5678",
//       isDefault: false,
//     },
//   ],
// };

interface ProfileSectionProps {
  onEditSection?: (section: string) => void;
}

const ProfileSection = memo(({ onEditSection }: ProfileSectionProps) => {
  const { user } = useAuth();
  const { openModal } = useModal();

  const handleEditClick = (section: string) => {
    if (section === "personalInfo") {
      openModal("personalInfo");
    } else if (section === "addresses") {
      openModal("addresses");
    }
    onEditSection?.(section);
  };

  const handleProfileImageChange = (imageUrl: string | null) => {
    console.log("프로필 이미지 업데이트:", imageUrl);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-6">프로필 정보</h2>
      {/* 프로필 섹션 */}
      <div className="flex gap-4">
        {/* 프로필 이미지 섹션 */}
        <div className="flex justify-center items-center mb-6 w-[400px]">
          <ProfileImage
            currentImage={user?.profileImage || undefined}
            userName={user?.name}
            onImageChange={handleProfileImageChange}
            size="lg"
          />
        </div>

        <Card className="mb-10 w-full">
          <CardHeader>
            <CardTitle className="text-lg">개인정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">이름</span>
                <span className="text-gray-900 font-medium">
                  {user?.name || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">사용자명</span>
                <span className="text-gray-900">{user?.username || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">이메일</span>
                <span className="text-gray-900">{user?.email || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">전화번호</span>
                <span className="text-gray-900">{user?.phone || "-"}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick("personalInfo")}
                className="w-full"
              >
                개인정보 수정
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <VirtualFittingVideos />

      <Card className="mb-10">
        <CardHeader>
          <CardTitle className="text-lg">배송지 관리</CardTitle>
        </CardHeader>
        <CardContent>
          {user?.addresses && user.addresses.length > 0 ? (
            <div className="space-y-4">
              {user.addresses.map((address, index) => (
                <div key={address.id || index}>
                  {index > 0 && <Separator className="my-3" />}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {address.name}
                      </span>
                      {address.isDefault && (
                        <span className="bg-black text-white text-xs px-2 py-1 rounded">
                          기본 배송지
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{address.recipient}</p>
                    <p className="text-sm text-gray-500">{address.full}</p>
                    <p className="text-xs text-gray-400">
                      {address.zipcode} | {address.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              등록된 주소가 없습니다.
            </p>
          )}
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditClick("addresses")}
              className="w-full"
            >
              주소 관리
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ProfileSection.displayName = "ProfileSection";

export default ProfileSection;
