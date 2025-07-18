import ProductCard from "@/components/common/ProductCard";
import { useCart } from "@/contexts/CartContext";

function Cart() {
  const { cartData, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCart();
  const cartItems = cartData.cart_product;

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="pt-[149px] px-4 pb-[96px]">
        <div className="mx-[112px]">
          {/* Page Title */}
          <div className="w-full mt-[30px] mb-[48px]">
            <div className="w-auto h-[24px] flex items-center justify-start">
              <span className="text-black text-lg font-inter font-normal leading-[12px] text-center">
                장바구니({cartItems.length})
              </span>
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full bg-white">
            <div className="flex flex-col gap-[100px]">
              {(() => {
                const cartRows = [];
                for (let i = 0; i < cartItems.length; i += 4) {
                  cartRows.push(cartItems.slice(i, i + 4));
                }
                return cartRows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-[85px] justify-items-center"
                  >
                    {row.map((item) => (
                      <ProductCard
                        key={item.product.product_id}
                        variant="cart"
                        product={item.product}
                        quantity={item.quantity}
                        onQuantityIncrease={() =>
                          increaseQuantity(item.product.product_id)
                        }
                        onQuantityDecrease={() =>
                          decreaseQuantity(item.product.product_id)
                        }
                        onRemove={() => removeFromCart(item.product.product_id)}
                      />
                    ))}
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
