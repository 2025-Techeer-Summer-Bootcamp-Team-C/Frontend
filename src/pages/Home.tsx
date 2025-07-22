import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/common/ProductCard";
import { useFilter } from "@/contexts/FilterContext";
import { useFittingContext } from "@/contexts/FittingContext";
import { useMemo, useState, useRef } from "react";
// API calls commented out for dummy data testing
import { useProductsQuery } from "@/hooks/useProducts";
import { startFittingDetail } from "@/api/fittings";
import { fetchProducts } from "@/api/products";
import { useFittingResultsPollingMutation } from "@/hooks/useFittings";
import VideoSection from "@/components/VideoSection";
import Audio from "@/components/Audio";

const Home = () => {
  const navigate = useNavigate();
  const { searchQuery } = useFilter();
  const { showFitting, setShowFitting } = useFittingContext();
  const [isFittingLoading, setIsFittingLoading] = useState(false);
  const [fittingProgress, setFittingProgress] = useState<string>("");
  const audioRef = useRef<{ setVolume: (volume: number) => void }>(null);
  // API calls commented out for dummy data testing
  const { data: products } = useProductsQuery(showFitting);
  // const { data: categories } = useCategoriesQuery();
  
  const fittingPollingMutation = useFittingResultsPollingMutation();
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleFittingClick = async () => {
    if (isFittingLoading || fittingPollingMutation.isPending) return;
    
    setIsFittingLoading(true);
    setFittingProgress("피팅 작업을 시작하는 중...");
    
    try {
      // 1. 현재 피팅 이미지 URL들을 가져와서 비교 기준점 설정
      let previousImageUrls: string[] = [];
      try {
        const currentProducts = await fetchProducts(true);
        if (currentProducts.products) {
          previousImageUrls = currentProducts.products
            .filter(product => product.image)
            .map(product => product.image);
        }
      } catch (error) {
        console.log("현재 피팅 결과를 가져올 수 없음:", error);
      }

      // 2. 피팅 작업 시작
      const response = await startFittingDetail();
      
      setFittingProgress(`피팅 작업이 시작되었습니다! (${response.total_products}개 상품)`);
      
      // 3. 피팅 결과 폴링 시작 (이미지 변경 감지)
      setFittingProgress("피팅 결과를 기다리는 중...");
      
      const fittingResults = await fittingPollingMutation.mutateAsync({ 
        previousImageUrls: previousImageUrls.length > 0 ? previousImageUrls : undefined,
        onProgress: (progress: string) => {
          setFittingProgress(progress);
        }
      });
      
      // 4. 피팅 결과 받아오기 성공
      setFittingProgress(`피팅 완료! ${fittingResults.products.length}개 상품 결과를 받았습니다.`);
      
      // 피팅 상태 업데이트 - 피팅 결과 보기 모드로 전환
      setShowFitting(true);
      
      // refetch 제거: 폴링에서 이미 최신 데이터를 받아옴
    } catch (error) {
      // 에러 처리
      const errorMessage = error instanceof Error ? error.message : "가상 피팅 요청 중 오류가 발생했습니다.";
      
      // 400 에러 (이미 피팅된 결과가 있음)인 경우 바로 피팅 결과 보기
      if ((error as any).response?.status === 400 && (error as any).response?.data?.error.includes("이미 가상")) {
        setFittingProgress("이미 피팅된 결과가 있습니다. 피팅 결과를 가져오는 중...");
        
        // 이미 피팅된 결과가 있으므로 바로 피팅 모드로 전환
        setShowFitting(true);
        setFittingProgress("이미 피팅된 결과를 표시합니다.");
        // 별도의 API 호출 없이 useProductsQuery가 showFitting=true로 자동 refetch됨
      } else if ((error as any).response?.status === 400 && (error as any).response?.data?.error.includes("사용자 사진")) {
        setFittingProgress("사용자 사진이 없습니다. 사진을 추가해 주세요.");
      } else if ((error as any).response?.status === 400 && (error as any).response?.data?.error.includes("상품이")) {
        setFittingProgress("상품이 없습니다. 상품을 추가해 주세요.");
      } else {
        setFittingProgress(`에러: ${errorMessage}`);
      }
    } finally {
      setIsFittingLoading(false);
      // 진행 상태 메시지는 잠시 후 제거
      setTimeout(() => setFittingProgress(""), 3000);
    }
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

  const handleVolumeChange = (volume: number) => {
    audioRef.current?.setVolume(volume);
  };

  return (
    <div className="w-full bg-white">
      <Audio ref={audioRef} />
      <VideoSection onVolumeChange={handleVolumeChange} />
      {/* Main Content */}
      <div className="flex justify-center pt-[200px] md:pt-[260px]">
        <div className="w-full max-w-[1201px] px-4 lg:px-8 xl:px-0">
          {/* Product Grid */}
          <div className="flex flex-col gap-[60px] md:gap-[80px]">
            {productRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-[80px] justify-items-center"
              >
                {row?.map((product) => (
                  <ProductCard
                    key={product.product_id}
                    variant="default"
                    product={product}
                    onProductClick={() =>
                      handleProductClick(product.product_id)
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 피팅하기 플로팅 버튼 */}
      <div className="fixed flex flex-col gap-1 bottom-6 right-6 z-50">
        {/* 진행 상태 메시지 */}
        {fittingProgress && (
          <div className="mb-2 w-[240px] bg-white text-black px-4 py-2 rounded-lg shadow-lg text-sm">
            {fittingProgress}
          </div>
        )}
        
        {/* 피팅 모드 토글 버튼 (피팅 완료 후) */}
        {showFitting && !isFittingLoading && (
          <button
            className="mb-2 w-[240px] bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors font-inter text-sm"
            onClick={() => setShowFitting(false)}
          >
            원본 상품 보기
          </button>
        )}
        
        {/* 메인 피팅 버튼 */}
        <button
          className="w-[240px] bg-black text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-colors font-inter text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleFittingClick}
          disabled={isFittingLoading}
        >
          {isFittingLoading ? "피팅 중..." : showFitting ? "피팅 다시하기" : "피팅하기"}
        </button>
      </div>
    </div>
  );
};

export default Home;
