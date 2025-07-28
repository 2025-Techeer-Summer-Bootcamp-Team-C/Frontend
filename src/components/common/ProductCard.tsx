import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";
import type { ProductCardVariant } from "@/types/variants";
import { usePrefetch } from "@/hooks/usePrefetch";
import { useFittingContext } from "@/contexts/FittingContext";

interface ProductCardProps {
  variant?: ProductCardVariant;
  product: Product;
  onProductClick?: () => void;
}

const ANIMATION_DURATION = 0.8;

const ProductCard = memo(
  ({ variant = "default", product, onProductClick }: ProductCardProps) => {
    const { prefetchProductDetail } = usePrefetch();
    const { showFitting, isFittingLoading } = useFittingContext();

    // 애니메이션 상태 관리
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationDirection, setAnimationDirection] = useState<
      "left-to-right" | "right-to-left"
    >("left-to-right");
    const [previousShowFitting, setPreviousShowFitting] = useState<
      boolean | null
    >(null); // null로 초기화

    // 호버 상태 및 프리패치된 이미지 관리
    const [isHovering, setIsHovering] = useState(false);
    const [prefetchedImages, setPrefetchedImages] = useState<string[] | null>(
      null
    );

    const getTextColor = () => {
      return variant === "viewed" ? "text-[#AAAAAA]" : "text-black";
    };

    const handleMouseEnter = async () => {
      setIsHovering(true);

      // 호버 시 상품 상세 정보 prefetch
      try {
        const prefetchedData = await prefetchProductDetail(product.product_id);
        if (prefetchedData?.product_images) {
          setPrefetchedImages(prefetchedData.product_images);
        }
      } catch (error) {
        console.error("Prefetch failed:", error);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    // showFitting 상태 변화 감지하여 이전 상태 저장
    useEffect(() => {
      // 피팅 모드가 꺼질 때 상태 초기화
      if (!showFitting && !isFittingLoading) {
        setPreviousShowFitting(null);
        setIsAnimating(false);
        return;
      }

      // 로딩 시작 시에만 이전 상태 저장
      if (isFittingLoading && previousShowFitting === null) {
        setPreviousShowFitting(!showFitting); // 현재와 반대 상태를 저장
      }
    }, [
      showFitting,
      isFittingLoading,
      previousShowFitting,
      product.product_id,
    ]);

    // 로딩 완료 시 애니메이션 트리거
    useEffect(() => {
      if (
        !isFittingLoading &&
        previousShowFitting !== null &&
        previousShowFitting !== showFitting &&
        !isAnimating
      ) {
        // 애니메이션 방향 결정
        const direction = showFitting ? "left-to-right" : "right-to-left";
        setAnimationDirection(direction);
        setIsAnimating(true);

        // 애니메이션 완료 후 상태 리셋
        const timer = setTimeout(() => {
          setIsAnimating(false);
          setPreviousShowFitting(showFitting); // 애니메이션 완료 후 상태 동기화
        }, ANIMATION_DURATION * 1000);

        return () => clearTimeout(timer);
      }
    }, [
      isFittingLoading,
      showFitting,
      previousShowFitting,
      isAnimating,
      product.product_id,
    ]);

    // 이미지 URL 결정 로직
    const getDisplayImage = () => {
      // 로딩 중이면 항상 원본 이미지만 표시
      if (isFittingLoading) {
        return product.image;
      }

      // 호버 상태일 때 프리패치된 이미지의 세 번째 이미지(product_images[2]) 표시
      if (isHovering && prefetchedImages && prefetchedImages[2]) {
        return prefetchedImages[2];
      }

      // 애니메이션 중이 아니면 현재 상태에 맞는 이미지 표시
      if (!isAnimating) {
        return showFitting && product.fittingImage
          ? product.fittingImage
          : product.image;
      }

      // 애니메이션 중일 때는 각각 다른 이미지 사용
      return product.image; // 기본값 (전경 이미지용)
    };

    // 배경 이미지: 애니메이션 시 드러날 새로운 이미지
    const backgroundImageUrl = isAnimating
      ? showFitting && product.fittingImage
        ? product.fittingImage
        : product.image
      : getDisplayImage();

    // 전경 이미지: 애니메이션 시 지워질 이전 이미지
    const foregroundImageUrl = isAnimating
      ? animationDirection === "left-to-right"
        ? product.image // 피팅하기: 원본이 지워짐
        : product.fittingImage || product.image // 원본보기: 피팅이 지워짐
      : getDisplayImage();

    return (
      <div
        className="w-full max-w-[240px] min-w-[180px] sm:w-[240px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product Image */}
        <div
          className="w-full h-[270px] sm:h-[360px] bg-white mb-2 cursor-pointer overflow-hidden hover:shadow-lg transition-shadow relative"
          onClick={onProductClick}
        >
          {/* 배경 이미지 (새로 나타날 이미지) - 애니메이션 중일 때만 표시 */}
          {isAnimating && (
            <img
              src={backgroundImageUrl}
              alt={showFitting ? `${product.name} - 피팅 결과` : product.name}
              className="w-full h-full object-contain absolute inset-0"
              style={{
                imageRendering: "auto",
              }}
            />
          )}

          {/* 전경 이미지 (지워질 이미지) - clip-path 애니메이션 적용 */}
          <motion.img
            key={`product-${product.product_id}`}
            src={foregroundImageUrl}
            alt={showFitting ? `${product.name} - 피팅 결과` : product.name}
            className="w-full h-full object-contain absolute inset-0 transition-transform duration-300"
            style={{
              imageRendering: "auto",
            }}
            animate={
              isAnimating
                ? {
                    clipPath:
                      animationDirection === "left-to-right"
                        ? "inset(0 0 0 100%)" // 좌→우로 지워짐 (피팅하기)
                        : "inset(0 100% 0 0)", // 우→좌로 지워짐 (원본 보기)
                  }
                : {
                    clipPath: "inset(0 0 0 0)",
                  }
            }
            transition={{
              duration: ANIMATION_DURATION,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Product Info Container */}
        <div className="flex flex-col">
          {/* Default and Viewed Layout */}
          <div className="w-fit min-w-full h-10 flex flex-col justify-center gap-1.5">
            <div className="flex flex-col justify-end gap-0.5 h-10">
              {/* Product Name and Color Options */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] sm:text-[13px] font-inter leading-tight ${getTextColor()}`}
                >
                  {product.name}
                </span>
              </div>

              {/* Price */}
              <span
                className={`text-[11px] sm:text-[13px] font-inter leading-tight font-medium ${getTextColor()}`}
              >
                ₩ {product.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
