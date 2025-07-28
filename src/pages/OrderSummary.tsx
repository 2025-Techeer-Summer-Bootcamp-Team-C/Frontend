import { useCart } from "@/contexts/CartContext";
import { useOrder } from "@/contexts/OrderContext";

function OrderSummary() {
  const { cartData, directPurchaseProduct } = useCart();
  const { currentBuyerInfo, getLatestOrder, getOrderCredit } = useOrder();

  // 최신 주문 정보 가져오기 (API 응답 데이터)
  const latestOrder = getLatestOrder();

  // API 응답 데이터가 있으면 사용, 없으면 기존 장바구니/직접구매 데이터 사용
  const orderData = latestOrder
    ? {
        orderDate: latestOrder.orderDate,
        products: latestOrder.products,
        totalPrice: latestOrder.totalPrice,
        productCount: latestOrder.products.reduce(
          (total, product) => total + product.quantity,
          0
        ),
      }
    : {
        orderDate: new Date().toISOString(),
        products: directPurchaseProduct
          ? [
              {
                cart_product_id: directPurchaseProduct.product_id,
                product_id: directPurchaseProduct.product_id,
                name: directPurchaseProduct.name,
                image: directPurchaseProduct.image || "",
                quantity: directPurchaseProduct.quantity,
                price: directPurchaseProduct.price,
              },
            ]
          : cartData?.cart_product?.map((item) => ({
              cart_product_id: item.cart_product_id,
              product_id: item.cart_product_id,
              name: item.name,
              image: item.image,
              quantity: item.quantity,
              price: item.price,
            })) || [],
        totalPrice: directPurchaseProduct
          ? directPurchaseProduct.price * directPurchaseProduct.quantity
          : cartData?.total_price || 0,
        productCount: directPurchaseProduct
          ? directPurchaseProduct.quantity
          : cartData?.cart_product?.length || 0,
      };

  const displayProductCount = orderData.productCount;

  // 사용자 크레딧 정보
  const { initial_credit, deducted_credit, remaining_credit } =
    getOrderCredit();

  return (
    <div className="min-h-screen w-[1216px] mx-auto bg-white">
      <div className="flex pt-[149px] px-4 gap-[100px]">
        <div className="max-w-[1216px] min-w-[400px]">
          {/* 주문 요약 제목 */}
          <h1 className="text-xl font-bold text-black mb-20">주문요약</h1>

          {/* 날짜 */}
          <div className="mb-2">
            <span className="flex items-center gap-2 text-xl font-medium text-black">
              날짜 -
              <div className="text-xl font-medium text-gray-500">
                {new Date(orderData.orderDate).toLocaleDateString("ko-KR")}
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
            {orderData.products.map((product) => (
              <img
                key={product.cart_product_id}
                className="w-[118px] h-[178px] bg-white object-contain rounded"
                src={product.image}
                alt={product.name}
              />
            ))}
          </div>
        </div>

        <div className="w-full space-y-[109px]">
          <div className="flex flex-col gap-28">
            {/* 배송 정보 */}
            <div className="space-y-3">
              <h2 className="text-[17px] font-bold text-black">배송 정보</h2>
              {currentBuyerInfo ? (
                <>
                  <p className="text-[17px] font-medium text-black">
                    이름 -{" "}
                    <span className="text-gray-500">
                      {currentBuyerInfo.name}
                    </span>
                  </p>
                  <p className="text-[17px] font-medium text-black">
                    우편번호 -{" "}
                    <span className="text-gray-500">
                      {currentBuyerInfo.postalCode}
                    </span>
                  </p>
                  <p className="text-[17px] font-medium text-black">
                    주소 -{" "}
                    <span className="text-gray-500">
                      {currentBuyerInfo.address}
                    </span>
                  </p>
                  {currentBuyerInfo.address2 && (
                    <p className="text-[17px] font-medium text-black">
                      상세주소 -{" "}
                      <span className="text-gray-500">
                        {currentBuyerInfo.address2}
                      </span>
                    </p>
                  )}
                  <p className="text-[17px] font-medium text-black">
                    전화번호 -{" "}
                    <span className="text-gray-500">
                      {currentBuyerInfo.phone}
                    </span>
                  </p>
                </>
              ) : (
                <p className="text-[17px] font-medium text-gray-500">
                  배송 정보를 입력해주세요.
                </p>
              )}
            </div>

            {/* 결제 정보 */}
            <div className="w-full space-y-3">
              <h2 className="text-[17px] font-bold text-black">결제 정보</h2>
              <div className="space-y-3">
                <p className="text-[17px] font-medium text-black">크레딧</p>
                <p className="text-[17px] font-medium text-black">
                  ₩{initial_credit.toLocaleString()} - ₩
                  {deducted_credit.toLocaleString()}= ₩
                  {remaining_credit.toLocaleString()}
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
