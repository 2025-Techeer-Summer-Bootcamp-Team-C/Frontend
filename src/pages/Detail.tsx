import { useParams } from "react-router-dom";
import ProductCard from "@/components/common/ProductCard";
import { productDummy } from "@/dummys/productDummy";
import { useNavigate } from "react-router-dom";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentProduct = productDummy.find(
    (product) => product.id === Number(id) && !product.is_deleted
  );

  if (!currentProduct) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="w-full bg-white">
      {/* Main Content */}
      <div className="flex justify-center">
        <div className="w-full max-w-[1201px] px-4 lg:px-8 xl:px-0">
          {/* Product Main Section */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-[100px] mb-[120px]">
            {/* Product Images Gallery */}
            <div className="flex-1">
              <div className="flex flex-col gap-4 items-end">
                {/* Main Product Image */}
                <div className="w-[532px] h-[800px] bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src=""
                    alt={currentProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Product Purchase Information */}
            <div className="flex-1 lg:max-w-[422px]">
              <div className="sticky top-[280px] flex flex-col gap-[35px]">
                {/* Product Basic Info */}
                <div className="flex flex-col gap-[5px] w-auto">
                  <p className="text-black text-[13px] font-inter leading-tight whitespace-nowrap">
                    재고 상태
                  </p>
                  <h1 className="text-black text-[20px] font-inter leading-tight whitespace-nowrap">
                    {currentProduct.name}
                  </h1>
                  <p className="text-black text-[20px] font-inter leading-tight whitespace-nowrap">
                    ₩ {currentProduct.price.toLocaleString()}
                  </p>
                </div>

                {/* Divider Line */}
                <div className="w-full h-[0.5px] bg-black"></div>

                {/* Color and Product Code */}
                <div className="flex items-center gap-[5px]">
                  <p className="text-black text-[10px] font-inter leading-tight whitespace-nowrap">
                    색상
                  </p>
                  <div className="w-[0.5px] h-[10px] bg-black"></div>
                  <p className="text-black text-[10px] font-inter leading-tight whitespace-nowrap">
                    상품코드
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-0 w-full">
                  <button
                    className="bg-white border border-black text-black text-[10px] font-inter py-[13px] px-[89px] w-[215px] h-[39px] flex items-center justify-center hover:bg-gray-50 transition-colors whitespace-nowrap"
                    onClick={() => navigate("/order")}
                  >
                    구매하기
                  </button>
                  <button className="bg-white border border-black text-black text-[10px] font-inter py-[13px] px-[62px] w-[207px] h-[39px] flex items-center justify-center hover:bg-gray-50 transition-colors whitespace-nowrap">
                    장바구니 추가하기
                  </button>
                </div>

                {/* Product Description */}
                <p className="text-black text-[10px] font-inter leading-tight whitespace-nowrap">
                  상품설명
                </p>

                {/* Additional Information */}
                <div className="flex flex-col gap-[14px] w-auto">
                  <p className="text-black text-[10px] font-inter leading-tight whitespace-nowrap">
                    제품 사이즈
                  </p>
                  <p className="text-black text-[10px] font-inter leading-tight whitespace-nowrap">
                    혼용률, 세탁 방법 및 원산지
                  </p>
                  <p className="text-black text-[10px] font-inter leading-tight whitespace-nowrap">
                    오프라인 매장에 재고 상태 보기
                  </p>
                  <p className="text-black text-[10px] font-inter leading-tight whitespace-nowrap">
                    배송, 교환 및 반품
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="flex flex-col gap-[80px] mb-[120px]">
            {/* 구성소재 Section */}
            <div className="flex justify-between mb-[120px] w-[1216px]">
              {/* 구성소재 소개 영역 */}
              <div className="flex flex-col rounded-lg justify-end">
                <h2 className="text-black text-[20px] lg:text-[24px] font-inter leading-tight mb-8">
                  구성소재
                </h2>
                <div className="flex flex-col gap-8">
                  <div>
                    <h3 className="text-black text-[16px] font-inter leading-tight mb-4">
                      메인 소재
                    </h3>
                    <p className="text-black text-[14px] font-inter leading-relaxed">
                      100% 프리미엄 코튼을 사용하여 부드러운 착용감과 뛰어난
                      내구성을 제공합니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-black text-[16px] font-inter leading-tight mb-4">
                      관리 방법
                    </h3>
                    <p className="text-black text-[14px] font-inter leading-relaxed">
                      찬물 세탁을 권장하며, 표백제 사용을 피해주세요.
                      드라이클리닝도 가능합니다.
                    </p>
                  </div>
                </div>
              </div>
              {/* 구성소재 이미지 영역 */}
              <div className="w-[532px] h-[800px] bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src=""
                  alt="Product Detail 1"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Product Detail Images */}
            <div className="w-full flex justify-between">
              <div className="w-[532px] h-[800px] bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src=""
                  alt="Product Detail 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[532px] h-[800px] bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src=""
                  alt="Product Detail 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Full Width Detail Image */}
            <div className="w-full flex justify-between">
              <div className="w-[532px] h-[800px] bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src=""
                  alt="Product Detail Full 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[532px] h-[800px] bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src=""
                  alt="Product Detail Full 2"
                  className="w-full h-full object-cover"
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
              {productDummy.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  variant="viewed"
                  product={product}
                  colorOptions={3}
                  onProductClick={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
