import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ProductCard from "@/components/common/ProductCard";

function Cart() {
  // Mock data for cart items
  const cartItems = [
    { 
      id: 1, 
      product_id: 1, 
      name: "상품명", 
      price: 49000, 
      quantity: 1, 
      image: "/placeholder-image.jpg",
      category_id: 1,
      content: "상품 설명",
      count: 1,
      created_at: new Date().toISOString()
    },
    { 
      id: 2, 
      product_id: 2, 
      name: "상품명", 
      price: 49000, 
      quantity: 1, 
      image: "/placeholder-image.jpg",
      category_id: 1,
      content: "상품 설명",
      count: 1,
      created_at: new Date().toISOString()
    },
    { 
      id: 3, 
      product_id: 3, 
      name: "상품명", 
      price: 49000, 
      quantity: 1, 
      image: "/placeholder-image.jpg",
      category_id: 1,
      content: "상품 설명",
      count: 1,
      created_at: new Date().toISOString()
    },
    { 
      id: 4, 
      product_id: 4, 
      name: "상품명", 
      price: 49000, 
      quantity: 1, 
      image: "/placeholder-image.jpg",
      category_id: 1,
      content: "상품 설명",
      count: 1,
      created_at: new Date().toISOString()
    },
    { 
      id: 5, 
      product_id: 5, 
      name: "상품명", 
      price: 49000, 
      quantity: 1, 
      image: "/placeholder-image.jpg",
      category_id: 1,
      content: "상품 설명",
      count: 1,
      created_at: new Date().toISOString()
    },
    { 
      id: 6, 
      product_id: 6, 
      name: "상품명", 
      price: 49000, 
      quantity: 1, 
      image: "/placeholder-image.jpg",
      category_id: 1,
      content: "상품 설명",
      count: 1,
      created_at: new Date().toISOString()
    },
  ];

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - cart 속성 */}
      <Header variant="cart" />

      {/* Main Content */}
      <div className="pt-[149px] px-4 pb-[96px]">
        <div className="mx-[112px]">
          {/* Page Title */}
          <div className="w-full h-[64px] mb-[48px]">
            <div className="w-[62px] h-[24px] mx-auto flex items-center justify-center">
              <span className="text-black text-[10px] font-inter font-normal leading-[12px] text-center">
                장바구니(6)
              </span>
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full bg-white">
            <div className="flex flex-col gap-[100px]">
              {/* First Row */}
              <div className="flex items-center justify-between gap-[85px]">
                {cartItems.slice(0, 4).map((item) => (
                  <ProductCard key={item.id} variant="cart" product={item} />
                ))}
              </div>

              {/* Second Row */}
              <div className="flex items-center justify-between gap-[85px]">
                {cartItems.slice(4, 8).map((item) => (
                  <ProductCard key={item.id} variant="cart" product={item} />
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