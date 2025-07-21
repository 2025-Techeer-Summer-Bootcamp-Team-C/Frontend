import { useCart } from "@/contexts/CartContext";

function OrderSummary() {
  const { cartData, directPurchaseProduct } = useCart();

  // 직접 구매 상품이 있으면 그것만, 없으면 장바구니 상품들 사용
  const isDirectPurchase = !!directPurchaseProduct;
  const displayPrice = isDirectPurchase
    ? directPurchaseProduct.price * directPurchaseProduct.quantity
    : cartData?.total_price || 0;
  const displayProductCount = isDirectPurchase
    ? directPurchaseProduct.quantity
    : cartData?.cart_product.length || 0;

  // 사용자 크레딧 정보
  const userCredit = 1000000;
  const remainingCredit = userCredit - displayPrice;
  return (
    <div className="min-h-screen w-[1216px] mx-auto bg-white">
      <div className="flex pt-[149px] px-4 gap-[100px]">
        <div className="max-w-[1216px]">
          {/* 주문 요약 제목 */}
          <h1 className="text-xl font-bold text-black mb-20">주문요약</h1>

          {/* 날짜 */}
          <div className="mb-2">
            <span className="flex items-center gap-2 text-xl font-medium text-black">
              날짜 -
              <div className="text-xl font-medium text-gray-500">
                {new Date().toLocaleDateString("ko-KR")}
              </div>
            </span>
          </div>

          {/* 상품 수 */}
          <div className="mb-8">
            <span className="flex items-center gap-2 text-xl font-medium text-black">
              상품 수 -
              <div className="text-xl font-medium text-gray-500">
                {displayProductCount}
              </div>
            </span>
          </div>

          {/* 상품 이미지들 */}
          <div className="flex gap-10 mb-16">
            {cartData?.cart_product.map((product) => (
              <img
                key={product.cart_product_id}
                className="w-[118px] h-[178px] bg-gray-200 rounded"
                src={product.image}
                alt={product.name}
              />
            ))}
          </div>
        </div>

        <div className="w-[493px] space-y-[109px]">
          <div className="flex flex-col gap-28">
            {/* 배송 정보 */}
            <div className="space-y-1.5">
              <h2 className="text-[17px] font-bold text-black">배송</h2>
              <p className="text-[17px] font-medium text-black">이름</p>
              <p className="text-[17px] font-medium text-black">주소</p>
              <p className="text-[17px] font-medium text-black">우편번호</p>
              <p className="text-[17px] font-medium text-black">편집</p>
            </div>

            {/* 결제 정보 */}
            <div className="w-[290px] space-y-3">
              <h2 className="text-[17px] font-bold text-black">결재</h2>
              <div className="space-y-3">
                <p className="text-[17px] font-medium text-black">크레딧</p>
                <p className="text-[17px] font-medium text-black">
                  ₩{userCredit.toLocaleString()} - ₩
                  {displayPrice.toLocaleString()}= ₩
                  {remainingCredit.toLocaleString()}
                </p>
                <p className="text-[13px] font-medium text-black">
                  현재 크레딧 - 사용 크레딧 = 크레딧 잔액
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
