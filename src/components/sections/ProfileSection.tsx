import { useState, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useModal } from "@/contexts/ModalContext";
import { useOrder } from "@/contexts/OrderContext";
import { formatPhoneNumber } from "@/lib/utils";
import ProfileImage from "@/components/common/ProfileImage";
import VirtualFittingVideos from "@/components/sections/VirtualFittingVideos";


interface ProfileSectionProps {
  onEditSection?: (section: string) => void;
}

interface PersonalInfo {
  name: string;
  username: string;
  email: string;
  phone: string;
}

const ProfileSection = memo(({ onEditSection }: ProfileSectionProps) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const { openModal } = useModal();
  const { currentBuyerInfo } = useOrder();

  const handleEditClick = (section: string) => {
    if (section === "personalInfo") {
      // 현재 표시된 데이터를 PersonalInfoForm의 초기값으로 전달
      const currentData = {
        name: personalInfo?.name || currentBuyerInfo?.name || "",
        username: personalInfo?.username || "",
        email: personalInfo?.email || "",
        phone: personalInfo?.phone || currentBuyerInfo?.phone || "",
      };
      
      // PersonalInfoForm에서 제출했을 때 personalInfo 상태 업데이트
      const handlePersonalInfoSubmit = (data: PersonalInfo) => {
        setPersonalInfo(data);
      };
      
      openModal("personalInfo", currentData, handlePersonalInfoSubmit);
    } else if (section === "addresses") {
      openModal("addresses");
    }
    onEditSection?.(section);
  };

  const handleProfileImageChange = (imageUrl: string | null) => {
    setProfileImage(imageUrl);
    // 실제로는 auth context나 API를 통해 서버에 저장
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
            currentImage={profileImage || undefined}
            userName={personalInfo?.name || currentBuyerInfo?.name || "사용자"}
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
                  {personalInfo?.name || currentBuyerInfo?.name || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">사용자명</span>
                <span className="text-gray-900">{personalInfo?.username || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">이메일</span>
                <span className="text-gray-900">{personalInfo?.email || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">전화번호</span>
                <span className="text-gray-900">{formatPhoneNumber(personalInfo?.phone || currentBuyerInfo?.phone || "")}</span>
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
          {currentBuyerInfo ? (
            <div className="space-y-4">
              <div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      기본 주소
                    </span>
                    <span className="bg-black text-white text-xs px-2 py-1 rounded">
                      기본 배송지
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{currentBuyerInfo.name}</p>
                  <p className="text-sm text-gray-500">
                    {currentBuyerInfo.address}
                    {currentBuyerInfo.address2 && `, ${currentBuyerInfo.address2}`}
                  </p>
                  <p className="text-xs text-gray-400">
                    {currentBuyerInfo.postalCode} | {formatPhoneNumber(currentBuyerInfo.phone)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {currentBuyerInfo.region} ({currentBuyerInfo.regionCode})
                  </p>
                </div>
              </div>
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
