import { useOrder } from "@/contexts/OrderContext";
import { useNavigate } from "react-router-dom";

function OrderHistory() {
  const navigate = useNavigate();
  const { getLatestOrder } = useOrder();
  const latestOrder = getLatestOrder();

  const handleContinueShopping = () => {
    navigate("/");
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };

  if (!latestOrder) {
    return (
      <div className="bg-white">
        <div className="pt-[149px] px-4 pb-8">
          <div className="ml-[114px] mb-9">
            <h1 className="text-black text-[20px] font-bold font-inter leading-[30px]">
              결재 내역
            </h1>
            <div className="w-[77px] h-[1px] bg-black mt-1"></div>
          </div>
          <div className="ml-[109px] text-center py-20">
            <p className="text-gray-500 text-lg">주문 내역이 없습니다.</p>
            <button
              onClick={handleContinueShopping}
              className="mt-8 w-[200px] h-[43px] bg-black text-white text-[15px] font-normal font-inter leading-[18px]"
            >
              쇼핑하러 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const firstProduct = latestOrder.products[0];
  const productCount = latestOrder.products.length;

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
          <div className="w-[118px] h-[178px] bg-gray-200 rounded overflow-hidden">
            {firstProduct && (
              <img
                src={firstProduct.product.image || ""}
                alt={firstProduct.product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Order Details */}
          <div className="w-[946px] flex flex-col gap-[59px]">
            {/* Header Row */}
            <div className="flex items-center">
              <span className="text-black text-[20px] font-medium font-inter leading-[30px] w-[120px]">
                날짜
              </span>
              <span className="text-black text-[20px] font-medium font-inter leading-[30px] w-[400px]">
                상품명
              </span>
              <span className="text-black text-[20px] font-medium font-inter leading-[30px] w-[100px]">
                상품 수
              </span>
            </div>

            {/* Data Row */}
            <div className="flex items-center">
              <span className="text-black text-[17px] font-normal font-inter leading-[25px] w-[120px]">
                {formatDate(latestOrder.orderDate)}
              </span>
              <span className="text-black text-[17px] font-normal font-inter leading-[25px] w-[400px]">
                {firstProduct?.product.name}
                {latestOrder.products.length > 1 && ` 외 ${latestOrder.products.length - 1}개`}
              </span>
              <span className="text-black text-[17px] font-normal font-inter leading-[25px] w-[100px]">
                {productCount}개
              </span>
            </div>

            {/* Details Row */}
            <div className="flex justify-between items-center">
              {/* Customer Info */}
              <div className="flex flex-col gap-[6px] w-auto">
                <span className="text-black text-[17px] font-medium font-inter leading-[25px]">
                  이름: {latestOrder.buyerInfo.name}
                </span>
                <span className="text-black text-[17px] font-medium font-inter leading-[25px]">
                  주소: {latestOrder.buyerInfo.address}
                </span>
                <span className="text-black text-[17px] font-medium font-inter leading-[25px]">
                  우편번호: {latestOrder.buyerInfo.postalCode}
                </span>
              </div>

              {/* Price Summary */}
              <div className="flex items-center gap-[22px]">
                <span className="text-black text-[15px] font-medium font-inter leading-[22px]">
                  총
                </span>
                <div className="flex flex-col w-auto">
                  <span className="text-black text-[15px] font-medium font-inter leading-[22px]">
                    ₩{formatPrice(latestOrder.totalPrice)}
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
