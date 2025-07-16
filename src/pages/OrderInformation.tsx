import { OrderInformationForm } from "@/components/forms/OrderInformationForm";
import Header from "@/components/common/Header";

function OrderInformation() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="주문" />

      <div className="pt-[149px] px-4 pb-[96px]">
        <div className="w-full max-w-4xl mx-auto">
          {/* 헤더 섹션 */}
          <div className="mb-8">
            <div className="w-full max-w-md mb-2">
              <h1 className="text-base font-normal text-black mb-2">
                영수증 주소 수정
              </h1>
              <p className="text-xs text-start text-black leading-relaxed">
                주문하기 위해 먼저 고객님의 계정 정보를 입력해야 합니다.
                언제든지 고객님의 계정에서 수정할 수 있습니다.
              </p>
            </div>

            <div className="bg-gray-100 p-3 rounded">
              <p className="text-xs text-black leading-relaxed">
                우편번호를 입력하여 주소를 검색하세요. 주소 필드는 검색을
                기반으로 자동 완성됩니다. 주소 2 필드에 필요한 정보를 입력하여
                주소를 완성할 수 있습니다.
              </p>
            </div>
          </div>

          <OrderInformationForm />
        </div>
      </div>
    </div>
  );
}

export default OrderInformation;
