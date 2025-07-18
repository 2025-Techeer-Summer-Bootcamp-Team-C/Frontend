import { useState, useEffect } from "react";
import type { Product } from "@/types/product";
import type { ProductCardVariant } from "@/types/variants";

interface ProductCardProps {
  variant?: ProductCardVariant;
  product: Product;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  onQuantityIncrease?: () => void;
  onQuantityDecrease?: () => void;
  onRemove?: () => void;
  onProductClick?: () => void;
}

const ProductCard = ({
  variant = "default",
  product,
  quantity = 1,
  onQuantityChange,
  onQuantityIncrease,
  onQuantityDecrease,
  onRemove,
  onProductClick,
}: ProductCardProps) => {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);

  useEffect(() => {
    setCurrentQuantity(quantity);
  }, [quantity]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setCurrentQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (onQuantityIncrease) {
      onQuantityIncrease();
    } else {
      handleQuantityChange(currentQuantity + 1);
    }
  };

  const handleDecrease = () => {
    if (onQuantityDecrease) {
      onQuantityDecrease();
    } else {
      handleQuantityChange(currentQuantity - 1);
    }
  };

  const getTextColor = () => {
    return variant === "viewed" ? "text-[#AAAAAA]" : "text-black";
  };

  return (
    <div className="w-full max-w-[240px] min-w-[180px] sm:w-[240px]">
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
        {variant === "cart" ? (
          /* Cart Layout */
          <div className="h-20 flex flex-col justify-center">
            {/* Product Info Section */}
            <div className="w-fit min-w-full h-10 flex flex-col justify-center gap-1.5">
              <div className="flex flex-col justify-end gap-0.5 h-10">
                {/* Product Name and Delete Button */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] sm:text-[13px] font-inter leading-tight ${getTextColor()}`}
                  >
                    {product.name}
                  </span>
                  {onRemove && (
                    <button
                      onClick={onRemove}
                      className=" hover:text-red-700 transition-colors text-[11px] sm:text-[13px] font-inter leading-tight mr-2"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Price */}
                <span
                  className={`text-[11px] sm:text-[13px] font-inter leading-tight font-medium ${getTextColor()}`}
                >
                  ₩ {product.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quantity Control */}
            <div className="w-30 h-8 flex flex-col justify-end gap-2.5 mt-2">
              <div className="flex items-center justify-between gap-4 sm:gap-[29px] bg-gray-50 rounded-md px-2 py-1">
                <button
                  onClick={handleDecrease}
                  className={`text-[11px] sm:text-[13px] font-inter leading-tight ${getTextColor()} cursor-pointer hover:opacity-70 transition-opacity w-4 h-4 flex items-center justify-center`}
                >
                  -
                </button>
                <span
                  className={`text-[11px] sm:text-[13px] font-inter leading-tight text-center ${getTextColor()} min-w-[12px]`}
                >
                  {currentQuantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className={`text-[11px] sm:text-[13px] font-inter leading-tight ${getTextColor()} cursor-pointer hover:opacity-70 transition-opacity w-4 h-4 flex items-center justify-center`}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Default and Viewed Layout */
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
        )}
      </div>
    </div>
  );
};

export default ProductCard;
