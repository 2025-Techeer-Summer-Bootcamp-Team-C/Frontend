import { useNavigate } from "react-router-dom";
import { useFilter } from "@/contexts/FilterContext";
import { useFittingContext } from "@/contexts/FittingContext";
import { useMemo, useState, useEffect, lazy, Suspense } from "react";

// Lazy load ProductCard for better code splitting
const ProductCard = lazy(() => import("@/components/common/ProductCard"));
import {
  useProductsQuery,
  useAllProductsFittingImages,
} from "@/hooks/useProducts";
import {
  fetchProductFittingImage,
  fetchCategoryProducts,
  type ProductFittingImageResponse,
} from "@/api/products";
import type { Product, CategoryResponse } from "@/types/product";
import {
  useStartFittingMutation,
  useFittingResultsPollingMutation,
} from "@/hooks/useFittings";
import { getUserImages } from "@/api/users";
import { useHeaderSticky } from "@/hooks/useHeaderSticky";
import { useModal } from "@/contexts/ModalContext";
import { MorphSpinner } from "@/components/ui/morph-spinner";

const Home = () => {
  const navigate = useNavigate();
  const { searchQuery, selectedCategoryId } = useFilter();
  const {
    showFitting,
    setShowFitting,
    isFittingLoading,
    setIsFittingLoading,
    currentUserImageId,
    setCurrentUserImageId,
    hasLastSelectedImage,
  } = useFittingContext();
  const [viewedProducts, setViewedProducts] = useState<string[]>([]);
  const [categoryProducts, setCategoryProducts] =
    useState<CategoryResponse | null>(null);
  const { openModal } = useModal();
  const isSticky = useHeaderSticky();
  const { data: products } = useProductsQuery();

  const startFittingMutation = useStartFittingMutation();
  const fittingPollingMutation = useFittingResultsPollingMutation();

  // 피팅 모드일 때 개별 상품별 피팅 이미지 폴링
  const { fittingResults, resetFittingResults, setManualFittingResults } =
    useAllProductsFittingImages(
      products?.products?.map((p) => p.product_id) || [],
      currentUserImageId,
      showFitting && currentUserImageId !== null
    );

  // localStorage에서 조회한 상품 목록 로드
  useEffect(() => {
    const savedViewedProducts = localStorage.getItem("viewedProducts");
    if (savedViewedProducts) {
      try {
        setViewedProducts(JSON.parse(savedViewedProducts));
      } catch (error) {
        console.error("Failed to parse viewed products:", error);
        localStorage.removeItem("viewedProducts");
      }
    }
  }, []);

  // 홈 페이지로 돌아올 때마다 피팅 모드 해제 (피팅 결과 ID는 보존)
  useEffect(() => {
    // setCurrentUserImageId(null); // ← 제거: 최근 피팅 결과 보존
    resetFittingResults();
  }, []); // 컴포넌트 마운트 시에만 실행

  // 카테고리별 상품 조회
  useEffect(() => {
    const loadCategoryProducts = async () => {
      if (selectedCategoryId === null) {
        setCategoryProducts(null);
        return;
      }

      try {
        const data = await fetchCategoryProducts(selectedCategoryId);
        setCategoryProducts(data);
      } catch (error) {
        console.error("카테고리별 상품 조회 실패:", error);
        setCategoryProducts(null);
      }
    };

    loadCategoryProducts();
  }, [selectedCategoryId]);

  // 조회한 상품 목록을 localStorage에 저장
  const saveViewedProducts = (products: string[]) => {
    setViewedProducts(products);
    localStorage.setItem("viewedProducts", JSON.stringify(products));
  };

  const handleProductClick = (productId: number) => {
    // 상품 조회 이력 저장 (중복 제거)
    const productIdStr = productId.toString();
    const updatedViewedProducts = [
      ...new Set([...viewedProducts, productIdStr]),
    ];
    saveViewedProducts(updatedViewedProducts);

    navigate(`/product/${productId}`);
  };

  const handleFittingClick = () => {
    if (
      isFittingLoading ||
      startFittingMutation.isPending ||
      fittingPollingMutation.isPending
    )
      return;

    openModal(
      "photoSelection",
      undefined,
      undefined,
      undefined,
      undefined,
      handlePhotoSelection
    );
  };

  const handlePhotoSelection = async (
    selectedPhoto: File | string | number
  ) => {
    console.log("선택된 사진:", selectedPhoto);

    // 선택된 이미지 타입에 따른 로그만 출력 (상태는 피팅 완료 후 설정)
    if (selectedPhoto instanceof File) {
      console.log("새로운 파일 선택:", selectedPhoto.name);
    } else if (typeof selectedPhoto === "number") {
      console.log("기존 피팅 결과 선택:", selectedPhoto);
      // 기존 결과 선택 시 즉시 currentUserImageId 설정
      setCurrentUserImageId(selectedPhoto);
    }

    setIsFittingLoading(true);

    // 2초 후 완료 텍스트로 변경
    setTimeout(() => {}, 2000);

    // 최소 3초 로딩 보장을 위한 타이머 시작
    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      // 선택된 사진이 숫자(user_image_id)인 경우 - 기존 피팅 결과 불러오기
      if (typeof selectedPhoto === "number") {
        console.log("기존 피팅 결과 불러오기 - user_image_id:", selectedPhoto);

        if (products?.products) {
          // 기존 피팅 결과 리셋
          resetFittingResults();

          // 상태 업데이트
          setCurrentUserImageId(selectedPhoto);
          setShowFitting(true);

          console.log("기존 피팅 결과 직접 조회 시작");

          // 모든 상품에 대해 기존 피팅 결과를 병렬로 조회
          const existingResults = await Promise.allSettled(
            products.products.map(async (product) => {
              try {
                const result = await fetchProductFittingImage(
                  product.product_id,
                  selectedPhoto
                );
                console.log(
                  `상품 ${product.product_id} 기존 피팅 결과 발견:`,
                  result
                );
                return { productId: product.product_id, result };
              } catch (error) {
                console.log(`상품 ${product.product_id} 기존 피팅 결과 없음`);
                return null;
              }
            })
          );

          // 성공한 결과들만 필터링해서 state에 반영
          const successfulResults: Record<number, ProductFittingImageResponse> =
            {};
          existingResults.forEach((promiseResult) => {
            if (promiseResult.status === "fulfilled" && promiseResult.value) {
              const { productId, result } = promiseResult.value;
              successfulResults[productId] = result;
            }
          });

          console.log("기존 피팅 결과 조회 완료:", successfulResults);

          // 조회한 결과를 state에 반영
          if (Object.keys(successfulResults).length > 0) {
            setManualFittingResults(successfulResults);
            console.log("기존 피팅 결과를 state에 반영 완료");
          }
        }

        // 최소 3초 대기
        await minLoadingTime;
      } else if (selectedPhoto instanceof File) {
        // 새로운 파일 업로드인 경우 - 피팅 시작 후 폴링
        console.log("새로운 피팅 시작");

        if (products?.products) {
          // 기존 피팅 결과 리셋
          resetFittingResults();

          // 1. 먼저 피팅 시작 (비용 발생, 한 번만)
          const startResult = await startFittingMutation.mutateAsync(
            selectedPhoto
          );
          console.log("피팅 시작 완료:", startResult);

          // 2. 피팅 결과 폴링 (재시도 안전)
          const fittingResults = await fittingPollingMutation.mutateAsync({
            userImageId: startResult.user_image_id,
            productIds: products.products.map((p) => p.product_id),
            onProgress: (completed, total) => {
              console.log(`피팅 진행률: ${completed}/${total}`);
            },
          });

          console.log("새 피팅 완료:", fittingResults);

          // 상태 업데이트
          setCurrentUserImageId(fittingResults.userImageId);
          setShowFitting(true);

          // 새로 생성된 피팅 결과를 state에 반영
          if (
            fittingResults.results &&
            Object.keys(fittingResults.results).length > 0
          ) {
            setManualFittingResults(fittingResults.results);
            console.log("새 피팅 결과를 state에 반영 완료");
          }
        }

        // 최소 3초 대기 (폴링 내부에서 이미 처리됨)
        await minLoadingTime;
      }
    } catch (error) {
      // 에러가 발생해도 일단 피팅 모드로 전환 (이미 피팅된 결과가 있는 경우 등)
      console.log("피팅 처리 중 에러:", error);

      // 에러 발생시에도 최소 3초는 대기
      await minLoadingTime;

      // 기존 사용자 이미지가 있다면 그것을 사용
      try {
        const userImages = await getUserImages();
        if (userImages.data && userImages.data.length > 0) {
          const latestUserImage = userImages.data[userImages.data.length - 1];
          setCurrentUserImageId(latestUserImage.id);
          resetFittingResults(); // 폴링 전 상태 리셋
          setShowFitting(true);
        }
      } catch (userImageError) {
        console.error("사용자 이미지 조회 실패:", userImageError);
      }
    } finally {
      // 로딩 상태 해제
      setIsFittingLoading(false);
    }
  };

  // 이전에 선택한 이미지로 바로 피팅하기
  const handleQuickFitting = async () => {
    if (
      isFittingLoading ||
      startFittingMutation.isPending ||
      fittingPollingMutation.isPending
    )
      return;

    // currentUserImageId가 있으면 해당 피팅 결과 재사용
    if (currentUserImageId) {
      console.log("바로 피팅하기: 현재 피팅 결과 재사용", currentUserImageId);
      await handlePhotoSelection(currentUserImageId);
    } else {
      console.log("바로 피팅하기: 이용 가능한 피팅 결과가 없습니다");
    }
  };

  // 검색어와 카테고리로 상품 필터링
  const filteredProducts = useMemo(() => {
    let sourceProducts: Product[] = [];

    if (selectedCategoryId !== null && categoryProducts) {
      // 카테고리 상품의 경우 속성명을 통일 (id -> product_id)
      sourceProducts =
        categoryProducts.data?.products?.map((product: any) => ({
          ...product,
          product_id: product.id || product.product_id, // id를 product_id로 매핑
        })) || [];
    } else {
      sourceProducts = products?.products || [];
    }

    const filtered = sourceProducts.filter((product: Product) => {
      if (!product || !product.name || !product.product_id) return false;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

    return filtered;
  }, [products?.products, categoryProducts, searchQuery, selectedCategoryId]);

  // 필터링된 상품을 4개씩 그룹화하여 행으로 나눔
  const productRows = useMemo(() => {
    if (!filteredProducts || filteredProducts.length === 0) return [];

    const rows = [];
    for (let i = 0; i < filteredProducts.length; i += 4) {
      const row = filteredProducts
        .slice(i, i + 4)
        .filter((product) => product && product.product_id);
      if (row.length > 0) {
        rows.push(row);
      }
    }
    return rows;
  }, [filteredProducts]);

  return (
    <div className="w-full bg-white relative">
      {/* 피팅 로딩 전체 화면 오버레이 */}
      {isFittingLoading && (
        <div className="fixed inset-0 z-[90] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <MorphSpinner
            size={80}
            message="AI가 당신에게 완벽한 핏을 찾고 있어요"
          />
        </div>
      )}

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
                {row?.map((product) => {
                  if (!product || !product.product_id) return null;

                  return (
                    <Suspense
                      key={product.product_id}
                      fallback={
                        <div className="w-[240px] h-[360px] bg-gray-100 animate-pulse rounded-lg"></div>
                      }
                    >
                      <ProductCard
                        variant={
                          viewedProducts.includes(product.product_id.toString())
                            ? "viewed"
                            : "default"
                        }
                        product={{
                          ...product,
                          // ProductCard에서 애니메이션 처리를 위해 피팅 이미지 정보 전달
                          fittingImage:
                            fittingResults[product.product_id]?.fitting_image ||
                            null,
                        }}
                        onProductClick={() =>
                          handleProductClick(product.product_id)
                        }
                      />
                    </Suspense>
                  );
                })}
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
            onClick={() => {
              setShowFitting(false);
              // setCurrentUserImageId(null); // ← 제거: 피팅 결과 ID 보존하여 바로 피팅하기 활성화
              resetFittingResults();
            }}
          >
            원본 상품 보기
          </button>
        )}

        {/* 바로 피팅하기 버튼 (이전 선택 이미지가 있는 경우) */}
        {!showFitting && hasLastSelectedImage && !isFittingLoading && (
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
          <span className="relative z-10 font-medium">사진 선택하기</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
