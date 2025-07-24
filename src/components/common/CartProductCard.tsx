import { memo, useCallback } from "react";
import type { CartItemResponse } from "@/types/cart";
import { useCart } from "@/contexts/CartContext";

interface CartProductCardProps {
  product: CartItemResponse;
  onProductClick?: () => void;
}

const CartProductCard = memo(
  ({ product, onProductClick }: CartProductCardProps) => {
    const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

    const handleIncrease = useCallback(() => {
      increaseQuantity(product.cart_product_id);
    }, [increaseQuantity, product.cart_product_id]);

    const handleDecrease = useCallback(() => {
      decreaseQuantity(product.cart_product_id);
      if (product.quantity === 1) {
        removeFromCart(product.cart_product_id);
      }
    }, [
      decreaseQuantity,
      removeFromCart,
      product.cart_product_id,
      product.quantity,
    ]);

    return (
      <div className="w-full max-w-[240px] min-w-[180px] sm:w-[240px]">
        {/* Product Image */}
        <div
          className="w-full h-[270px] sm:h-[360px] bg-white mb-2 cursor-pointer overflow-hidden hover:shadow-lg transition-shadow"
          onClick={onProductClick}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info Container */}
        <div className="flex flex-col">
          {/* Cart Layout */}
          <div className="h-20 flex flex-col justify-center">
            {/* Product Info Section */}
            <div className="w-fit min-w-full h-10 flex flex-col justify-center gap-1.5">
              <div className="flex flex-col justify-end gap-0.5 h-10">
                {/* Product Name and Delete Button */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-[13px] font-inter leading-tight text-black">
                    {product.name}
                  </span>
                  <button
                    onClick={() => removeFromCart(product.cart_product_id)}
                    className=" hover:text-red-700 transition-colors text-[11px] sm:text-[13px] font-inter leading-tight mr-2"
                  >
                    ✕
                  </button>
                </div>

                {/* Price */}
                <span className="text-[11px] sm:text-[13px] font-inter leading-tight font-medium text-black">
                  ₩ {product.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quantity Control */}
            <div className="w-30 h-8 flex flex-col justify-end gap-2.5 mt-2">
              <div className="flex items-center justify-between gap-4 sm:gap-[29px] bg-gray-50 rounded-md px-2 py-1">
                <button
                  onClick={handleDecrease}
                  className="text-[11px] sm:text-[13px] font-inter leading-tight text-black cursor-pointer hover:opacity-70 transition-opacity w-4 h-4 flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-[11px] sm:text-[13px] font-inter leading-tight text-center text-black min-w-[12px]">
                  {product.quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="text-[11px] sm:text-[13px] font-inter leading-tight text-black cursor-pointer hover:opacity-70 transition-opacity w-4 h-4 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CartProductCard.displayName = "CartProductCard";

export default CartProductCard;
