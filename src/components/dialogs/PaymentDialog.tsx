import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PaymentDialogVariant } from "@/types/variants";
import { X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";

interface PaymentDialogProps {
  children: React.ReactNode; // Dialog를 여는 버튼
  totalPrice?: number; // 'confirm' 상태일 때 필요한 가격
  orderNumber?: string; // 'complete' 상태일 때 필요한 주문번호
  buyerInfo?: {
    name: string;
    phone: string;
    address: string;
    productName: string;
  };
  onConfirm?: () => void; // '결제하기' 버튼 클릭 시 실행될 함수
  onClose?: () => void; // '확인' 버튼 클릭(완료 시) 또는 닫기 버튼 클릭 시 실행될 함수
}

export const PaymentDialog = ({
  children,
  totalPrice = 0,
  orderNumber = "01234567890",
  buyerInfo,
  onConfirm,
  onClose,
}: PaymentDialogProps) => {
  const navigate = useNavigate();
  const [currentVariant, setCurrentVariant] =
    useState<PaymentDialogVariant>("confirm");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const { cartData, clearCart, directPurchaseProduct } = useCart();
  const { getLatestOrder } = useOrder();
  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR");
  };

  const handleConfirm = () => {
    // 이미 생성된 주문에 대한 결제 승인 처리
    const latestOrder = getLatestOrder();

    if (!latestOrder) {
      alert("주문 정보를 찾을 수 없습니다.");
      return;
    }

    console.log("결제 승인:", latestOrder);

    // 장바구니에서 온 경우 장바구니 클리어
    if (!directPurchaseProduct && cartData?.cart_product?.length) {
      clearCart();
    }

    // UI 상태 변경 - 결제 완료
    setCurrentVariant("complete");
    onConfirm?.();
  };

  const handleComplete = () => {
    navigate("/history");
    if (onClose) onClose();
  };

  const dialogClassName =
    currentVariant === "confirm"
      ? "w-[711px] !max-w-[711px] h-[739px] bg-white p-0 overflow-hidden border-0"
      : "w-[711px] !max-w-[711px] h-[400px] bg-white p-0 overflow-hidden border-0";

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          // 결제 완료 상태에서 다이얼로그를 닫으면 /history로 이동
          if (currentVariant === "complete") {
            navigate("/history");
          }
          setCurrentVariant("confirm");
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={dialogClassName} showCloseButton={false}>
        {/* --- 헤더 및 닫기 버튼 --- */}
        <DialogHeader className="p-0">
          <DialogTitle className="sr-only">
            {currentVariant === "confirm" ? "상품 결제" : "결제 완료"}
          </DialogTitle>
          <DialogClose className="absolute top-[25px] right-[18px] w-[18px] h-[18px] z-10 p-0 hover:bg-transparent">
            <X size={18} className="text-[#8A8A8A]" />
          </DialogClose>
        </DialogHeader>

        {/* --- 결제 확인(confirm) 상태일 때의 UI --- */}
        {currentVariant === "confirm" && (
          <div className="px-12 pt-9 pb-9">
            {/* Header */}
            <div className="pb-8 text-center">
              <h1 className="mb-2.5 text-3xl font-bold">상품 결제</h1>
              <p className="text-[15px]">
                아래의 이용 크레딧으로 최종 결제를 진행합니다
              </p>
            </div>

            {/* Credit Information */}
            <div className="mb-5 bg-[#F7F7F7] rounded-md py-4 px-8 text-center">
              <p className="text-xl font-medium leading-loose">
                ₩1,000,000 - ₩{formatPrice(totalPrice)} = ₩
                {formatPrice(1000000 - totalPrice)}
              </p>
              <p className="text-[13px] font-medium">
                [현재 크레딧 - 사용 크레딧 = 크레딧 잔액]
              </p>
            </div>

            {/* Buyer Information */}
            <div className="mb-9">
              <h2 className="mb-6 text-[15px] font-bold">구매자 정보</h2>
              <div className="flex flex-col gap-6 text-[15px]">
                <div className="flex items-center gap-10">
                  <div className="flex items-end gap-5 w-[400px]">
                    <span>이름</span>
                    <span className="text-gray-600">
                      {buyerInfo?.name || "-"}
                    </span>
                  </div>
                  <div className="flex items-end gap-5 w-full">
                    <span>전화번호</span>
                    <span className="text-gray-600">
                      {buyerInfo?.phone || "-"}
                    </span>
                  </div>
                </div>
                <div className="flex items-end gap-5 w-full">
                  <span>주소</span>
                  <span className="text-gray-600">
                    {buyerInfo?.address || "-"}
                  </span>
                </div>
                <div className="flex items-end gap-5 w-full">
                  <span>구매 상품명</span>
                  <span className="text-gray-600">
                    {buyerInfo?.productName || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="mb-9">
              <div className="bg-[#F7F7F7] p-4 mb-1 rounded-md text-[10px] leading-tight">
                <h3 className="text-[13px] font-normal leading-loose mb-2">
                  결제시 유의사항
                </h3>
                <div className="font-medium">
                  <p>
                    세금계산서 발행시 입력하신 정보는 회사설정-회사정보조회에
                    반명됩니다.
                  </p>
                  <p>
                    폐업된 사업자번호로 결제시 세금계산서가 발행되지 않을 수
                    있으니 유의바랍니다.
                  </p>
                  <p>
                    결제 이후 해지하셔도 해당 결제만료일 까지 사용 가능합니다.
                  </p>
                  <p>
                    서비스 사용요금 환불의 경우, 사용방법에 따라 상이하게
                    적용되며 자세한 내용은 Techeer고객센터 및 영업담당자에게
                    문의하세요.
                  </p>
                  <p>
                    한도초과, 잔액부족 등으로 결제오류가 발생할 경우
                    미납요금으로 처리되어 서비스 이용이 불가할 수 있습니다.
                  </p>
                  <p>
                    결제 모듈이 나타나지 않는 경우, 브라우저 팝업차단기능을
                    해제해 주세요.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={isTermsAccepted}
                  onChange={(e) => setIsTermsAccepted(e.target.checked)}
                  className="w-3 h-3 border border-black"
                />
                <label htmlFor="terms" className="text-xs font-medium">
                  결제시 유의 사항을 확인하였고 이에 동의합니다.
                </label>
              </div>
            </div>

            {/* Payment Button */}
            <div className="flex justify-center">
              <button
                onClick={handleConfirm}
                disabled={!isTermsAccepted}
                className={`text-[15px] font-medium leading-6 h-10 px-6 flex items-center justify-center transition-colors ${
                  isTermsAccepted
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                결제하기
              </button>
            </div>
          </div>
        )}

        {/* --- 결제 완료(complete) 상태일 때의 UI --- */}
        {currentVariant === "complete" && (
          <div className="px-12 py-6 text-center flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-5">결제 완료</h1>
            <p className="text-lg text-gray-500 mb-9">
              주문번호 : {getLatestOrder()?.orderNumber || orderNumber}
            </p>
            <p className="text-base mb-16">
              결제가 완료 되었습니다.
              <br />
              상품은 구매일로부터 3~7일 내에 출고 됩니다.
              <br />
              주문은 결제 내역에서 확인하실 수 있습니다.
            </p>
            <DialogClose asChild>
              <button
                onClick={handleComplete}
                className="bg-black text-white text-[15px] font-medium leading-6 h-10 px-12 flex items-center justify-center"
              >
                확인
              </button>
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
