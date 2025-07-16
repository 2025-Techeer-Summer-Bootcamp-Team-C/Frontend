import Header from "@/components/common/Header";
import ProductCard from "@/components/common/ProductCard";
import { useCart } from "@/contexts/CartContext";

function Cart() {
  const { cartData, updateQuantity } = useCart();
  const cartItems = cartData.cart_product;

  return (
    <div className="min-h-screen bg-white">
      {/* Header - cart 속성 */}
      <Header variant="cart" />

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
                        key={item.id}
                        variant="cart"
                        product={item.product}
                        quantity={item.quantity}
                        onQuantityChange={(quantity) => updateQuantity(item.product.id, quantity)}
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
