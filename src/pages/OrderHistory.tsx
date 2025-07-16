import { useNavigate } from "react-router-dom";

function OrderHistory() {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <div className="bg-white">
      {/* Main Content */}
      <div className="pt-[149px] px-4 pb-8">
        {/* Page Title */}
        <div className="ml-[114px] mb-9">
          <h1 className="text-black text-[20px] font-bold font-inter leading-[30px]">
            결재 내역
          </h1>
          <div className="w-[77px] h-[1px] bg-black mt-1"></div>
        </div>

        {/* Order Content */}
        <div className="ml-[109px] flex items-start gap-[66px]">
          {/* Product Image */}
          <div className="w-[118px] h-[178px] bg-gray-200 rounded"></div>

          {/* Order Details */}
          <div className="w-[946px] flex flex-col gap-[59px]">
            {/* Header Row */}
            <div className="flex items-center gap-[191px]">
              <span className="text-black text-[20px] font-medium font-inter leading-[30px]">
                날짜
              </span>
              <span className="text-black text-[20px] font-medium font-inter leading-[30px]">
                상품명
              </span>
              <span className="text-black text-[20px] font-medium font-inter leading-[30px]">
                상품 수
              </span>
            </div>

            {/* Details Row */}
            <div className="flex justify-between items-center">
              {/* Customer Info */}
              <div className="flex flex-col gap-[6px] w-auto">
                <span className="text-black text-[17px] font-medium font-inter leading-[25px]">
                  이름
                </span>
                <span className="text-black text-[17px] font-medium font-inter leading-[25px]">
                  주소
                </span>
                <span className="text-black text-[17px] font-medium font-inter leading-[25px]">
                  우편번호
                </span>
              </div>

              {/* Price Summary */}
              <div className="flex items-center gap-[22px]">
                <span className="text-black text-[15px] font-medium font-inter leading-[22px]">
                  총
                </span>
                <div className="flex flex-col w-auto">
                  <span className="text-black text-[15px] font-medium font-inter leading-[22px]">
                    ₩49,000
                  </span>
                  <span className="text-black text-[15px] font-medium font-inter leading-[22px]">
                    *부가세 포함
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="ml-[105px] mt-[38px] w-[1198px] h-[1px] bg-[#C1BCBC]"></div>

        {/* Continue Shopping Button */}
        <div className="flex justify-end mr-[137px] mt-[115px]">
          <button
            onClick={handleContinueShopping}
            className="w-[200px] h-[43px] bg-black flex items-center justify-center py-[18px]"
          >
            <span className="text-white text-[15px] font-normal font-inter leading-[18px] text-center">
              계속 쇼핑하기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
