type FooterVariant = "default" | "cart" | "order";

interface FooterProps {
  variant?: FooterVariant;
  totalPrice?: number;
  onContinue?: () => void;
  onAddGift?: () => void;
}

const Footer = ({ 
  variant = "default", 
  totalPrice = 0,
  onContinue,
  onAddGift 
}: FooterProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  // Cart와 Order 공통 컴포넌트
  if (variant === "cart" || variant === "order") {
    const isCart = variant === "cart";
    const containerClass = isCart ? "justify-center" : "justify-end";
    const containerWidth = isCart ? "max-w-[1239px]" : "w-[286px]";

    return (
      <footer className="w-full bg-white">
        <div className={`w-full h-[96px] flex items-center ${containerClass} px-4`}>
          <div className={`${containerWidth} h-[44px] relative`}>
            {/* Terms Text - Cart Only */}
            {isCart && (
              <div className="absolute left-0 top-[15px] w-[475px] h-[12px]">
                <span className="text-black text-[10px] font-inter leading-tight">
                  계속 진행함으로써 본인은 구매 조건을 읽고 이에 동의하며 자사의 개인정보 및 쿠키 정책을 이해했음을 선언합니다.
                </span>
              </div>
            )}

            {/* Gift Option - Cart Only */}
            {isCart && (
              <div className="absolute left-[541px] top-[16px] flex items-center gap-[19px]">
                <span className="text-black text-[10px] font-inter leading-tight">
                  선물용으로 주문하시겠습니까?
                </span>
                <button 
                  onClick={onAddGift}
                  className="text-black text-[10px] font-inter leading-tight hover:opacity-70 transition-opacity cursor-pointer"
                >
                  추가
                </button>
              </div>
            )}

            {/* Total Price */}
            <div className={`absolute ${isCart ? "right-[286px]" : "left-0"} top-[6px] w-[88px] flex justify-between items-center gap-[29px]`}>
              <span className="text-black text-[10px] font-inter leading-tight">총</span>
              <div className="w-[49px] flex flex-col gap-2">
                <span className="text-black text-[10px] font-inter leading-tight">
                  ₩ {formatPrice(totalPrice)}
                </span>
                <span className="text-black text-[9px] font-inter leading-tight">
                  *부가세 포함
                </span>
              </div>
            </div>

            {/* Continue Button */}
            <button 
              onClick={onContinue}
              className="absolute right-0 top-0 w-[162px] h-[44px] bg-black flex items-center justify-center gap-2.5 px-[71px] py-4 hover:bg-gray-800 transition-colors"
            >
              <span className="text-white text-[10px] font-inter leading-tight">계속</span>
            </button>
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
    "대표번호 : 02-123-4567"
  ];

  const companyInfoSecondRow = [
    "통신판매 신고 : 제 2014-서울강남 -12345 (사업자정보확인)",
    "개인정보처리방침",
    "이용약관", 
    "지금보증안내"
  ];

  const renderTextWithDividers = (texts: string[], className: string = "") => (
    <div className={`flex items-center gap-4 ${className}`}>
      {texts.map((text, index) => (
        <div key={index} className="flex items-center gap-4">
          <span className="text-black text-[9px] font-inter leading-tight whitespace-nowrap">{text}</span>
          {index < texts.length - 1 && <div className="w-0 h-2 border-l border-black flex-shrink-0"></div>}
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
              <span className="text-black text-[9px] font-inter leading-tight whitespace-nowrap">Techeer Fashion</span>
              <span className="text-black text-[9px] font-inter leading-tight whitespace-nowrap">SOUTH KOREA / 대한민국</span>
            </div>

            {/* Company Details */}
            <div className="flex flex-col gap-[3px]">
              {renderTextWithDividers(companyInfoFirstRow)}
              {renderTextWithDividers(companyInfoSecondRow, "items-end gap-[19px]")}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-end gap-5 pb-[100px] flex-shrink-0">
            {/* Language Selection */}
            <div className="flex items-end gap-[6px]">
              <span className="text-black text-[9px] font-inter leading-tight whitespace-nowrap">한국어</span>
              <div className="w-0 h-[9px] border-l border-black flex-shrink-0"></div>
              <span className="text-black text-[9px] font-inter leading-tight whitespace-nowrap">ENGLISH</span>
            </div>

            {/* Copyright */}
            <div className="flex items-center gap-[5px]">
              <div className="w-[9px] h-[9px] relative flex-shrink-0">
                <div className="w-[9px] h-[9px] bg-[#D9D9D9] border border-[#D9D9D9] rounded-full"></div>
                <span className="absolute left-[2px] top-0 text-white text-[7px] font-inter leading-tight">C</span>
              </div>
              <span className="text-black text-[9px] font-inter leading-tight whitespace-nowrap">ALL RIGHTS RESERVED</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
