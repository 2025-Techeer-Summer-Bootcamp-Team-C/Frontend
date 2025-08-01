import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ProductDetail } from "@/types/product";
import { useProductsQuery } from "@/hooks/useProducts";
import { lazy, Suspense } from "react";

// Lazy load ProductCard for better code splitting
const ProductCard = lazy(() => import("@/components/common/ProductCard"));

interface CartAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductDetail;
}

const CartAddDialog = ({ isOpen, onClose, product }: CartAddDialogProps) => {
  const navigate = useNavigate();

  const { data: products } = useProductsQuery();

  const handleCartView = () => {
    navigate("/cart");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="!max-w-[544px] !w-[544px] !h-full !p-0 !m-0 !rounded-none !border-none !bg-white !shadow-none"
      >
        {/* Dialog Content */}
        <div className="w-full h-full bg-white flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="pt-[53px] px-[40px]">
            <SheetHeader>
              <SheetTitle className="text-black text-[15px] font-inter font-medium leading-[23px] tracking-[-0.017em]">
                장바구니에 추가됨
              </SheetTitle>
            </SheetHeader>
          </div>

          <div className="flex justify-start items-center">
            {/* Added Product Image */}
            <div className="pl-[44px] pr-[20px] mt-[76px]">
              <div className="w-[134.4px] h-[201.6px] bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={product.model_image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="h-full flex items-start pt-[76px] w-[300px]">
              <div className="flex flex-col gap-[7px] w-full">
                <p className="text-black text-[14px] font-inter font-bold leading-[18px] tracking-[-0.013em] break-words">
                  {product.name}
                </p>
                <p className="text-black text-[12px] font-inter font-medium leading-[18px] tracking-[-0.013em] break-words">
                  {product.content.split("/")[0]}
                </p>
                <p className="text-black text-[12px] font-inter font-medium leading-[18px] tracking-[-0.013em]">
                  {product.price}원
                </p>
              </div>
            </div>
          </div>

          {/* Cart View Button */}
          <div className="px-[44px] mt-[39px]">
            <button
              onClick={handleCartView}
              className="w-[134px] h-[27px] bg-white border-[0.5px] border-black flex items-center justify-center px-[32px] py-[5px] hover:bg-gray-50 transition-colors"
            >
              <span className="text-black text-[11px] font-inter font-medium leading-[17px] tracking-[-0.012em]">
                장바구니 보기
              </span>
            </button>
          </div>

          {/* Other Products Section */}
          <div className="px-[40px] mt-[80px]">
            <h3 className="text-black text-[15px] font-inter font-medium leading-[23px] tracking-[-0.017em] mb-[45px]">
              다른 사람들이 많이 본 상품
            </h3>

            {/* Products Grid */}
            <div className="grid grid-cols-3 gap-[26px] w-[455.2px]">
              {products?.products
                .filter((item) => item.product_id !== product.product_id)
                .slice(0, 6)
                .map((item) => (
                  <div
                    key={item.product_id}
                    className="[&>div]:w-[134.4px] [&>div>div:first-child]:!w-[134.4px] [&>div>div:first-child]:!h-[201.6px] [&>div>div:last-child_span]:!text-[12px] [&>div>div:last-child_span]:!leading-tight"
                  >
                    <Suspense
                      fallback={
                        <div className="w-[134.4px] h-[201.6px] bg-gray-100 animate-pulse rounded-lg"></div>
                      }
                    >
                      <ProductCard
                        product={item}
                        onProductClick={() => {
                          navigate(`/product/${item.product_id}`);
                          onClose();
                        }}
                      />
                    </Suspense>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartAddDialog;
