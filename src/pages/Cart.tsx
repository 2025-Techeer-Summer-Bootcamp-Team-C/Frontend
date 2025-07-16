import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/common/ProductCard";
import { cartDummy } from "@/dummys/cartDummy";

function Cart() {
  // Use cartDummy data
  const cartData = cartDummy;
  const cartItems = cartData.cart_product;
  const totalPrice = cartData.total_price;

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
              {/* First Row */}
              <div className="flex items-center justify-between gap-[85px]">
                {cartItems.slice(0, 4).map((item) => (
                  <ProductCard
                    key={item.id}
                    variant="cart"
                    product={item.product}
                  />
                ))}
              </div>

              {/* Second Row */}
              <div className="flex items-center justify-between gap-[85px]">
                {cartItems.slice(4, 8).map((item) => (
                  <ProductCard
                    key={item.id}
                    variant="cart"
                    product={item.product}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - cart 속성 */}
      <Footer variant="cart" totalPrice={totalPrice} />
    </div>
  );
}

export default Cart;
