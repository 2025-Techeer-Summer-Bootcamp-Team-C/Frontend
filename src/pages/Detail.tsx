import { useParams } from "react-router-dom";
import { useState, lazy, Suspense, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Lazy load components for better code splitting
const ProductCard = lazy(() => import("@/components/common/ProductCard"));
const CartAddDialog = lazy(() => import("@/components/dialogs/CartAddDialog"));
import { useCart } from "@/contexts/CartContext";
import { useFittingContext } from "@/contexts/FittingContext";
import { useOrder } from "@/contexts/OrderContext";
import type { Product, ProductDetail } from "@/types/product";
import {
  useProductDetailQuery,
  useProductFittingImageMutation,
} from "@/hooks/useProducts";
import { useProductsQuery } from "@/hooks/useProducts";
import { useGenerateFittingVideoMutation } from "@/hooks/useFittings";
import { Play, Loader2 } from "lucide-react";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isAuthenticated } = useCart();
  const { showFitting, currentUserImageId } = useFittingContext();
  const { createSingleProductOrder } = useOrder();
  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const quantitySelectorRef = useRef<HTMLDivElement>(null);
  const { data: productList } = useProductsQuery();
  const { data: currentProduct } = useProductDetailQuery(Number(id));
  const {
    mutate: generateVideo,
    data: videoData,
    isPending: isVideoLoading,
  } = useGenerateFittingVideoMutation();

  // 0: 상품설명, 1: 구성소재
  const productInfo = currentProduct?.content.split("/") || [];
  const categoryId = currentProduct?.category_id;

  // 카테고리별 사이즈 컬럼 정의
  const getSizeColumns = (categoryId: number | undefined) => {
    if (categoryId === 1 || categoryId === 3) {
      return ["가슴둘레", "앞면길이", "소매길이", "등너비", "팔너비"];
    } else if (categoryId === 2) {
      return ["허리둘레", "엉덩이둘레", "앞면길이", "앞면밑위", "윗면밑위"];
    } else {
      return ["가슴둘레", "허리둘레", "엉덩이둘레", "어깨너비", "소매길이"]; // 기본값
    }
  };

  // showFitting이 true일 때만 해당 상품의 피팅 이미지 조회
  const fittingImageQuery = useProductFittingImageMutation();

  // useEffect로 API 호출 (렌더링 중 side effect 방지)
  useEffect(() => {
    if (showFitting && currentUserImageId && id) {
      fittingImageQuery.mutate({
        productId: Number(id),
        userImageId: currentUserImageId,
      });
    }
  }, [showFitting, currentUserImageId, id]); // fittingImageQuery는 의존성에서 제외

  // 이미지 결정 로직: 피팅 모드일 때 피팅 이미지, 아니면 원본 이미지
  const displayImage =
    showFitting && fittingImageQuery.data?.fitting_image
      ? fittingImageQuery.data.fitting_image
      : currentProduct?.model_image;

  // 외부 클릭 시 수량 선택기 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        quantitySelectorRef.current &&
        !quantitySelectorRef.current.contains(event.target as Node)
      ) {
        setShowQuantitySelector(false);
      }
    };

    if (showQuantitySelector) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showQuantitySelector]);

  const handlePurchaseClick = async () => {
    // 로그인 상태 확인
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (showQuantitySelector) {
      // 수량 선택 완료 후 주문 생성 API 호출
      if (currentProduct) {
        try {
          await createSingleProductOrder(
            currentProduct.product_id,
            purchaseQuantity,
            currentProduct.model_image
          );
          navigate("/order");
        } catch (error) {}
      }
    } else {
      // 수량 선택 UI 표시
      setShowQuantitySelector(true);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setPurchaseQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // 로그인 상태 확인
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (currentProduct) {
      addToCart(currentProduct as unknown as Product, 1);
      setIsCartDialogOpen(true);
    }
  };

  const handleVideoGenerate = () => {
    if (currentProduct && currentUserImageId) {
      generateVideo({
        product_id: currentProduct.product_id,
        user_image_id: currentUserImageId,
      });
    }
  };

  if (!currentProduct) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="w-full bg-white mt-[100px]">
      {/* Main Content */}
      <div className="flex justify-center">
        <div className="w-full max-w-[1201px] px-4 lg:px-8 xl:px-0">
          {/* Product Main Section */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-[100px] mb-[200px]">
            {/* Product Images Gallery */}
            <div className="flex-1">
              <div className="flex flex-col gap-4 items-end">
                {/* Main Product Image */}
                <div
                  className="relative w-[532px] h-[800px] bg-gray-200 overflow-hidden group"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {/* 기본 이미지 또는 비디오 */}
                  {showFitting &&
                  isHovering &&
                  videoData?.status === "completed" &&
                  videoData.video_url ? (
                    <video
                      src={videoData.video_url}
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-contain bg-white"
                    />
                  ) : (
                    <img
                      src={displayImage}
                      alt={`${currentProduct.name}${
                        showFitting ? " - 피팅 결과" : " - 모델 착용"
                      }`}
                      className={`w-full h-full object-contain bg-white transition-all duration-300 ${
                        showFitting
                          ? "group-hover:blur-sm group-hover:brightness-75"
                          : ""
                      }`}
                    />
                  )}
                  {/* 호버 시 나타나는 영상보기 버튼 - showFitting이 true일 때만 표시 */}
                  {showFitting &&
                    (!videoData || videoData.status !== "completed") && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={handleVideoGenerate}
                          disabled={isVideoLoading}
                          className="bg-white/90 cursor-pointer hover:bg-white text-black font-inter font-medium text-[14px] px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isVideoLoading ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              로딩중...
                            </>
                          ) : (
                            <>
                              <Play size={16} className="fill-current" />
                              영상보기
                            </>
                          )}
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Product Purchase Information */}
            <div className="flex-1 lg:max-w-[422px]">
              <div className="sticky top-[280px] flex flex-col gap-[35px]">
                {/* Product Basic Info */}
                <div className="flex flex-col gap-[5px] w-auto">
                  <h1 className="text-black text-[20px] font-inter leading-tight whitespace-nowrap">
                    {currentProduct.name}
                  </h1>
                  <p className="text-black text-[20px] font-inter leading-tight whitespace-nowrap">
                    ₩ {currentProduct.price.toLocaleString()}
                  </p>
                </div>

                {/* Divider Line */}
                <div className="w-full h-[0.5px] bg-black"></div>

                {/* Action Buttons */}
                <div className="flex items-center gap-0 w-full">
                  {showQuantitySelector ? (
                    <div
                      ref={quantitySelectorRef}
                      className="bg-white border border-black text-black text-[10px] font-inter py-[13px] w-[215px] h-[39px] flex items-center justify-between px-4"
                    >
                      <span>수량</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(purchaseQuantity - 1)
                          }
                          className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded"
                        >
                          -
                        </button>
                        <span className="min-w-[20px] text-center">
                          {purchaseQuantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(purchaseQuantity + 1)
                          }
                          className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={handlePurchaseClick}
                        className="w-10 h-5 flex items-center justify-center hover:bg-gray-200 rounded"
                      >
                        확인
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-white border border-black text-black text-[10px] font-inter py-[13px] w-[215px] h-[39px] flex items-center justify-center hover:bg-gray-50 transition-colors whitespace-nowrap"
                      onClick={handlePurchaseClick}
                    >
                      구매하기
                    </button>
                  )}
                  <button
                    className="bg-white border border-black text-black text-[10px] font-inter py-[13px] px-[62px] w-[207px] h-[39px] flex items-center justify-center hover:bg-gray-50 transition-colors whitespace-nowrap"
                    onClick={handleAddToCart}
                  >
                    장바구니 추가하기
                  </button>
                </div>
                {/* Product Description */}
                <div className="flex flex-col gap-[20px]">
                  <div className="flex flex-col gap-[5px]">
                    <p className="text-black text-[16px] font-inter leading-tight">
                      상품설명
                    </p>
                    <p className="text-black text-[14px] font-inter leading-tight break-words">
                      {productInfo[0] || ""}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[5px]">
                    <p className="text-black text-[16px] font-inter leading-tight">
                      구성 소재
                    </p>
                    <p className="text-black text-[14px] font-inter leading-tight break-words">
                      {productInfo[1] || ""}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[5px]">
                    <p className="text-black text-[16px] font-inter leading-tight">
                      사이즈 정보
                    </p>
                    <p className="text-black text-[14px] font-inter leading-tight">
                      프리 사이즈
                    </p>
                    {productInfo[2] && (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              {getSizeColumns(categoryId).map(
                                (column, index) => (
                                  <th
                                    key={index}
                                    className="border border-gray-300 px-2 py-1 text-[12px] font-inter text-black"
                                  >
                                    {column}
                                  </th>
                                )
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              {productInfo[2]
                                .split(",")
                                .slice(0, 5)
                                .map((size, index) => (
                                  <td
                                    key={index}
                                    className="border border-gray-300 px-2 py-1 text-[12px] font-inter text-black text-center"
                                  >
                                    {size.trim()}
                                  </td>
                                ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="flex flex-col gap-[80px] mb-[120px]">
            {/* Product Detail Images */}
            <div className="w-full flex justify-between">
              <div className="w-[532px] h-[800px] bg-white rounded-lg overflow-hidden">
                <img
                  src={currentProduct.product_images[0]}
                  alt="Product Detail 1"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-[532px] h-[800px] bg-white rounded-lg overflow-hidden">
                <img
                  src={currentProduct.product_images[1]}
                  alt="Product Detail 2"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="w-full flex justify-between">
              <div className="w-[532px] h-[800px] bg-white rounded-lg overflow-hidden">
                <img
                  src={currentProduct.product_images[2]}
                  alt="Product Detail 3"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-[532px] h-[800px] bg-white rounded-lg overflow-hidden">
                <img
                  src={currentProduct.product_images[3]}
                  alt="Product Detail 4"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* 다른 고객이 함께 본 제품 Section */}
          <div className="mb-[80px]">
            <h2 className="text-black text-[20px] lg:text-[24px] font-inter leading-tight mb-8">
              다른 고객이 함께 본 제품
            </h2>

            {/* Related Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-[80px] justify-items-center">
              {productList?.products
                .filter((product) => product.product_id !== Number(id))
                .slice(0, 4)
                .map((product) => (
                  <Suspense
                    key={product.product_id}
                    fallback={
                      <div className="w-[240px] h-[360px] bg-gray-100 animate-pulse rounded-lg"></div>
                    }
                  >
                    <ProductCard
                      product={product}
                      onProductClick={() => {
                        navigate(`/product/${product.product_id}`);
                      }}
                    />
                  </Suspense>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Add Dialog */}
      {isCartDialogOpen && (
        <Suspense fallback={<div></div>}>
          <CartAddDialog
            isOpen={isCartDialogOpen}
            onClose={() => setIsCartDialogOpen(false)}
            product={currentProduct as unknown as ProductDetail}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Detail;
