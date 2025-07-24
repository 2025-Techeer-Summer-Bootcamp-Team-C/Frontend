import { memo } from "react";
import type { Product } from "@/types/product";
import type { ProductCardVariant } from "@/types/variants";
import { usePrefetch } from "@/hooks/usePrefetch";

interface ProductCardProps {
  variant?: ProductCardVariant;
  product: Product;
  onProductClick?: () => void;
}

const ProductCard = memo(
  ({ variant = "default", product, onProductClick }: ProductCardProps) => {
    const { prefetchProductDetail } = usePrefetch();

    const getTextColor = () => {
      return variant === "viewed" ? "text-[#AAAAAA]" : "text-black";
    };

    const handleMouseEnter = () => {
      // 호버 시 상품 상세 정보 prefetch
      prefetchProductDetail(product.product_id);
    };

    return (
      <div
        className="w-full max-w-[240px] min-w-[180px] sm:w-[240px]"
        onMouseEnter={handleMouseEnter}
      >
        {/* Product Image */}
        <div
          className="w-full h-[270px] sm:h-[360px] bg-gray-200 mb-2 cursor-pointer overflow-hidden hover:shadow-lg transition-shadow"
          onClick={onProductClick}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
