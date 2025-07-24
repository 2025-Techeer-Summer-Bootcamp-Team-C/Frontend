import { useNavigate, useLocation } from "react-router-dom";
import type { FooterVariant } from "@/types/variants";
import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";
import { useMemo, lazy, Suspense } from "react";

// Lazy load dialog
const PaymentDialog = lazy(() => import("@/components/dialogs/PaymentDialog").then(module => ({ default: module.PaymentDialog })));

interface FooterProps {
  variant?: FooterVariant;
  buttonText?: string;
  totalPrice?: number;
  buyerInfo?: {
    name: string;
    phone: string;
    address: string;
    productName: string;
  };
  onContinue?: () => void;
}

const Footer = ({
  variant = "default",
  buttonText = "계속",
  totalPrice = 0,
  buyerInfo: propBuyerInfo,
  onContinue,
}: FooterProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setDirectPurchaseProduct, cartData, directPurchaseProduct } = useCart();
  const { submitOrderForm, currentBuyerInfo } = useOrder();
  const path = location.pathname;

  // PaymentDialog에 전달할 구매자 정보 계산 (summary 페이지에서만)
  const calculatedBuyerInfo = useMemo(() => {
    if (!path.includes("/summary") || !currentBuyerInfo) return undefined;
    
    const fullAddress = currentBuyerInfo.address2 
      ? `${currentBuyerInfo.address} ${currentBuyerInfo.address2}`
      : currentBuyerInfo.address;
    
    // 구매 상품명 계산
    let productName = '';
    const isDirectPurchase = !!directPurchaseProduct;
    
    if (isDirectPurchase && directPurchaseProduct) {
      productName = directPurchaseProduct.name;
    } else if (cartData?.cart_product && cartData.cart_product.length > 0) {
      const firstProduct = cartData.cart_product[0];
      if (cartData.cart_product.length === 1) {
        productName = firstProduct.name;
      } else {
        productName = `${firstProduct.name} 외 ${cartData.cart_product.length - 1}개`;
      }
    }
    
    return {
      name: currentBuyerInfo.name,
      phone: currentBuyerInfo.phone,
      address: fullAddress,
      productName: productName
    };
  }, [path, currentBuyerInfo, directPurchaseProduct, cartData]);

  // 최종적으로 사용할 buyerInfo (props로 전달된 것이 있으면 우선, 없으면 계산된 값)
  const buyerInfo = propBuyerInfo || calculatedBuyerInfo;

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR");
  };

  // Cart와 Order 공통 컴포넌트
  if (variant === "cart" || variant === "order") {
    const isCart = variant === "cart";
    const containerClass = isCart ? "justify-center" : "justify-end";
    const containerWidth = isCart ? "w-full" : "w-[340px]";

    // 주문 요약 페이지에서는 버튼 텍스트 변경
    if (path.includes("/summary")) {
      buttonText = "결제 승인";
    }

    return (
      <footer className="fixed bottom-0 w-full bg-white">
        <div
          className={`w-full min-h-[96px] flex items-center ${containerClass} px-25`}
        >
          <div className={`${containerWidth} h-[44px]`}>
            {/* Left Section - Cart Only */}
            <div className="flex justify-between items-center">
              {/* Terms Text - Cart Only */}
              {isCart && (
                <div className="w-auto">
                  <span className="text-black text-[10px] font-inter leading-tight">
                    계속 진행함으로써 본인은 구매 조건을 읽고 이에 동의하며
                    자사의 개인정보 및 쿠키 정책을 이해했음을 선언합니다.
                  </span>
                </div>
              )}

              {/* Gift Option - Cart Only */}
              {isCart && (
                <div className="flex items-center gap-[19px]">
                  <span className="text-black text-[10px] font-inter leading-tight">
                    선물용으로 주문하시겠습니까?
                  </span>
                  <button
                    onClick={() => {}}
                    className="text-black text-[10px] font-inter leading-tight hover:opacity-70 transition-opacity cursor-pointer"
                  >
                    추가
                  </button>
                </div>
              )}

              {/* Bottom Section */}
              <div className="flex justify-between items-center w-[340px] h-[44px]">
                {/* Total Price */}
                <div className="flex justify-between items-center gap-6">
                  <span className="text-black text-4 font-inter leading-tight">
                    총
                  </span>
                  <div className="flex flex-col gap-2">
                    <span className="text-black text-4 font-inter leading-tight">
                      ₩ {formatPrice(totalPrice)}
                    </span>
                    <span className="text-black text-3 font-inter leading-tight">
                      *부가세 포함
                    </span>
                  </div>
                </div>

                {/* Continue Button */}
                {path.includes("/summary") ? (
                  <Suspense fallback={<button className="w-[162px] h-[44px] bg-black flex items-center justify-center gap-2.5 px-auto py-4" disabled><span className="text-white text-4 font-inter leading-tight">{buttonText}</span></button>}>
                    <PaymentDialog
                      totalPrice={totalPrice}
                      buyerInfo={buyerInfo}
                      onConfirm={() => {
                        navigate("/summary");
                      }}
                    >
                      <button className="w-[162px] h-[44px] bg-black flex items-center justify-center gap-2.5 px-auto py-4 hover:bg-gray-800 transition-colors">
                        <span className="text-white text-4 font-inter leading-tight">
                          {buttonText}
                        </span>
                      </button>
                    </PaymentDialog>
                  </Suspense>
                ) : (
                  <button
                    onClick={() => {
                      if (onContinue) {
                        submitOrderForm();
                        onContinue();
                      } else if (path.includes("/order")) {
                        submitOrderForm();
                      } else {
                        // 장바구니에서 주문으로 넘어갈 때 직접 구매 상품 초기화
                        if (path.includes("/cart")) {
                          setDirectPurchaseProduct(null);
                        }
                        navigate("/order");
                      }
                    }}
                    className="w-[162px] h-[44px] bg-black flex items-center justify-center gap-2.5 px-auto py-4 hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-white text-4 font-inter leading-tight">
                      {buttonText}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Default Footer
  const companyInfoFirstRow = [
    "테커코리아 주식회사",
    "사업자등록번호 : 120-88-14744",
    "대표자 : Andrew Park",
    "서울특별시 강남구 강남로",
    "대표번호 : 02-123-4567",
  ];

  const companyInfoSecondRow = [
    "통신판매 신고 : 제 2014-서울강남 -12345 (사업자정보확인)",
    "개인정보처리방침",
    "이용약관",
    "지금보증안내",
  ];

  const renderTextWithDividers = (texts: string[], className: string = "") => (
    <div className={`flex items-center gap-4 ${className}`}>
      {texts.map((text, index) => (
        <div key={index} className="flex items-center gap-4">
          <span className="text-black text-[9px] font-inter leading-tight whitespace-nowrap">
            {text}
          </span>
          {index < texts.length - 1 && (
            <div className="w-0 h-2 border-l border-black flex-shrink-0"></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <footer className="w-full bg-white">
      <div className="w-full flex items-start justify-between px-4 py-8">
        <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center gap-[200px]">
          {/* Left Section */}
          <div className="flex-1 min-w-0 flex flex-col gap-[92px]">
            {/* Brand and Country */}
            <div className="flex flex-col gap-[14px]">
              <span className="text-black text-[9px] font-inter leading-tight whitespace-nowrap">
                Techeer Fashion
              </span>
              <span className="text-black text-[9px] font-inter leading-tight whitespace-nowrap">
                SOUTH KOREA / 대한민국
              </span>
            </div>

            {/* Company Details */}
            <div className="flex flex-col gap-[3px]">
              {renderTextWithDividers(companyInfoFirstRow)}
              {renderTextWithDividers(
                companyInfoSecondRow,
                "items-end gap-[19px]"
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-end gap-5 pb-[100px] flex-shrink-0">
            {/* Language Selection */}
            <div className="flex items-end gap-[6px]">
              <span className="text-black text-[9px] font-inter leading-tight whitespace-nowrap">
                한국어
              </span>
              <div className="w-0 h-[9px] border-l border-black flex-shrink-0"></div>
              <span className="text-black text-[9px] font-inter leading-tight whitespace-nowrap">
                ENGLISH
              </span>
            </div>

            {/* Copyright */}
            <div className="flex items-center gap-[5px]">
              <div className="w-[9px] h-[9px] relative flex-shrink-0">
                <div className="w-[9px] h-[9px] bg-[#D9D9D9] border border-[#D9D9D9] rounded-full"></div>
                <span className="absolute left-[2px] top-0 text-white text-[7px] font-inter leading-tight">
                  C
                </span>
              </div>
              <span className="text-black text-[9px] font-inter leading-tight whitespace-nowrap">
                ALL RIGHTS RESERVED
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
