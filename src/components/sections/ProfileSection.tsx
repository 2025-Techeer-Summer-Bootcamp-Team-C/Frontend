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

interface Address {
  id: string;
  name: string;
  recipient: string;
  zipcode: string;
  address1: string;
  address2?: string;
  phone: string;
  isDefault: boolean;
}

const ProfileSection = memo(({ onEditSection }: ProfileSectionProps) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const { openModal } = useModal();
  const { currentBuyerInfo } = useOrder();

  // BuyerInfo를 Address 형식으로 변환하는 함수
  const convertBuyerInfoToAddress = (buyerInfo: typeof currentBuyerInfo): Address => {
    return {
      id: "temp_buyer_address", // 임시 ID
      name: "기본 주소 (주문 정보에서)",
      recipient: buyerInfo!.name,
      zipcode: buyerInfo!.postalCode,
      address1: buyerInfo!.address,
      address2: buyerInfo!.address2 || "",
      phone: buyerInfo!.phone,
      isDefault: true,
    };
  };

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
      // AddressManagement에서 주소 변경 시 호출될 콜백
      const handleAddressSubmit = (updatedAddresses: Address[]) => {
        setAddresses(updatedAddresses);
      };
      
      // 초기 주소 데이터 준비
      let initialAddressData: Address[] = [];
      
      // 1. 사용자가 저장한 주소가 있으면 그것을 사용
      if (addresses.length > 0) {
        initialAddressData = addresses;
      }
      // 2. 없으면 currentBuyerInfo를 Address 형식으로 변환하여 사용
      else if (currentBuyerInfo) {
        initialAddressData = [convertBuyerInfoToAddress(currentBuyerInfo)];
      }
      
      openModal("addresses", undefined, undefined, handleAddressSubmit, initialAddressData);
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
          {addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((address, index) => (
                <div key={address.id}>
                  {index > 0 && <div className="border-t pt-4" />}
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
                    <p className="text-sm text-gray-500">
                      {address.address1}
                      {address.address2 && `, ${address.address2}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {address.zipcode} | {formatPhoneNumber(address.phone)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : currentBuyerInfo ? (
            <div className="space-y-4">
              <div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      기본 주소 (주문 정보에서)
                    </span>
                    <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                      임시 배송지
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
