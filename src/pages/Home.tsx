import { useNavigate } from "react-router-dom";
import { useFilter } from "@/contexts/FilterContext";
import { useFittingContext } from "@/contexts/FittingContext";
import { useMemo, useState, lazy, Suspense } from "react";

// Lazy load ProductCard for better code splitting
const ProductCard = lazy(() => import("@/components/common/ProductCard"));
import { useProductsQuery } from "@/hooks/useProducts";
import { startFittingDetail } from "@/api/fittings";
import { fetchProducts } from "@/api/products";
import { useFittingResultsPollingMutation } from "@/hooks/useFittings";
import { useHeaderSticky } from "@/hooks/useHeaderSticky";
import { useModal } from "@/contexts/ModalContext";

const Home = () => {
  const navigate = useNavigate();
  const { searchQuery } = useFilter();
  const {
    showFitting,
    setShowFitting,
    isFittingLoading,
    setIsFittingLoading,
    lastSelectedImage,
    setLastSelectedImage,
    hasLastSelectedImage,
  } = useFittingContext();
  const [buttonText, setButtonText] = useState<string>("피팅하기");
  const { openModal } = useModal();
  const isSticky = useHeaderSticky();
  const { data: products } = useProductsQuery(showFitting);

  const fittingPollingMutation = useFittingResultsPollingMutation();

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleFittingClick = () => {
    if (isFittingLoading || fittingPollingMutation.isPending) return;

    openModal(
      "photoSelection",
      undefined,
      undefined,
      undefined,
      undefined,
      handlePhotoSelection
    );
  };

  const handlePhotoSelection = async (selectedPhoto: File | string) => {
    console.log("선택된 사진:", selectedPhoto);

    // 선택된 이미지를 컨텍스트에 저장
    if (selectedPhoto instanceof File) {
      setLastSelectedImage(selectedPhoto);
    }

    setIsFittingLoading(true);
    setButtonText("피팅 중...");

    // 2초 후 완료 텍스트로 변경
    setTimeout(() => {
      setButtonText("완료!");
    }, 2000);

    // 최소 3초 로딩 보장을 위한 타이머 시작
    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      // 1. 현재 피팅 이미지 URL들을 가져와서 비교 기준점 설정
      let previousImageUrls: string[] = [];
      try {
        const currentProducts = await fetchProducts(true);
        if (currentProducts.products) {
          previousImageUrls = currentProducts.products
            .filter((product) => product.image)
            .map((product) => product.image);
        }
      } catch (error) {
        console.log("현재 피팅 결과를 가져올 수 없음:", error);
      }

      // 2. 피팅 작업 시작
      await startFittingDetail();

      // 3. 피팅 결과 폴링 시작 (이미지 변경 감지)
      await fittingPollingMutation.mutateAsync({
        previousImageUrls:
          previousImageUrls.length > 0 ? previousImageUrls : undefined,
      });

      // 4. 최소 3초와 실제 API 완료 시간 중 더 긴 시간까지 대기
      await minLoadingTime;

      // refetch 제거: 폴링에서 이미 최신 데이터를 받아옴
    } catch (error) {
      // 에러가 발생해도 일단 피팅 모드로 전환 (이미 피팅된 결과가 있는 경우 등)
      console.log("피팅 처리 중 에러:", error);

      // 에러 발생시에도 최소 3초는 대기
      await minLoadingTime;
    } finally {
      // 로딩 상태 해제 및 이미지 변경
      setShowFitting(true);
      setIsFittingLoading(false);
      setButtonText(showFitting ? "피팅 다시하기" : "피팅하기");
    }
  };

  // 이전에 선택한 이미지로 바로 피팅하기
  const handleQuickFitting = async () => {
    if (
      !lastSelectedImage ||
      isFittingLoading ||
      fittingPollingMutation.isPending
    )
      return;

    await handlePhotoSelection(lastSelectedImage);
  };

  // Using dummy data instead of API
  // 검색어와 카테고리로 상품 필터링
  const filteredProducts = useMemo(
    () =>
      products?.products?.filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        // 카테고리 매칭: category_id를 통해 카테고리 이름 찾기
        // const productCategory = categories?.find(cat => cat.categoryName === product.category_name)?.name;
        // const matchesCategory = selectedCategory === "모두 보기" || productCategory === selectedCategory;

        return matchesSearch;
      }),
    [products?.products, searchQuery]
  );

  // 필터링된 상품을 4개씩 그룹화하여 행으로 나눔
  const productRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < (filteredProducts?.length ?? 0); i += 4) {
      rows.push(filteredProducts?.slice(i, i + 4));
    }
    return rows;
  }, [filteredProducts]);

  return (
    <div className="w-full bg-white relative">
      {/* Main Content */}
      <div
        className={`flex justify-center pt-[100px] ${
          isSticky ? "pt-[200px]" : ""
        }`}
      >
        <div className="w-full max-w-[1201px] px-4 lg:px-8 xl:px-0">
          {/* Product Grid */}
          <div className="flex flex-col gap-[60px] md:gap-[80px]">
            {productRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-[80px] justify-items-center"
              >
                {row?.map((product) => (
                  <Suspense
                    key={product.product_id}
                    fallback={
                      <div className="w-[240px] h-[360px] bg-gray-100 animate-pulse rounded-lg"></div>
                    }
                  >
                    <ProductCard
                      variant="default"
                      product={product}
                      onProductClick={() =>
                        handleProductClick(product.product_id)
                      }
                    />
                  </Suspense>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 피팅하기 플로팅 버튼 - 동영상/온보딩 섹션이 z-index로 가림 */}
      <div className="fixed flex flex-col gap-2 bottom-6 right-6 z-50">
        {/* 피팅 모드 토글 버튼 (피팅 완료 후) */}
        {showFitting && !isFittingLoading && (
          <button
            className="w-[240px] bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors font-inter text-sm"
            onClick={() => setShowFitting(false)}
          >
            원본 상품 보기
          </button>
        )}

        {/* 바로 피팅하기 버튼 (이전 선택 이미지가 있는 경우) */}
        {hasLastSelectedImage && !isFittingLoading && (
          <button
            className="w-[240px] bg-white border border-black border-solid border-2 text-black px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors font-inter text-sm"
            onClick={handleQuickFitting}
          >
            바로 피팅하기
          </button>
        )}

        {/* 메인 피팅 버튼 */}
        <button
          className={`w-[240px] px-6 py-3 rounded-lg shadow-lg font-inter text-sm disabled:cursor-not-allowed relative overflow-hidden ${
            isFittingLoading
              ? "bg-black text-white"
              : "bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          }`}
          onClick={handleFittingClick}
          disabled={isFittingLoading}
        >
          {/* 진행 배경 애니메이션 */}
          {isFittingLoading && (
            <div
              className="absolute inset-0 bg-green-400"
              style={{
                animation: "slideRight 3s linear forwards",
              }}
            />
          )}

          {/* 버튼 텍스트 */}
          <span className="relative z-10 font-medium">
            {isFittingLoading ? buttonText : "피팅하기"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Home;
