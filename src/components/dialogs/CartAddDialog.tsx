import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import ProductCard from "@/components/common/ProductCard";
import { productDummy } from "@/dummys/productDummy";
import type { Product } from "@/types/product";

interface CartAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const CartAddDialog = ({ isOpen, onClose, product }: CartAddDialogProps) => {
  const navigate = useNavigate();

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
            <h2 className="text-black text-[15px] font-inter font-medium leading-[23px] tracking-[-0.017em]">
              장바구니에 추가됨
            </h2>
          </div>

          <div className="flex justify-start items-center">
            {/* Added Product Image */}
            <div className="pl-[44px] pr-[20px] mt-[76px]">
              <div className="w-[134.4px] h-[201.6px] bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src=""
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="h-full flex items-center pb-20">
              <div className="flex flex-col gap-[7px]">
                <p className="text-black text-[12px] font-inter font-medium leading-[18px] tracking-[-0.013em]">
                  {product.name}
                </p>
                <p className="text-black text-[12px] font-inter font-medium leading-[18px] tracking-[-0.013em]">
                  사이즈
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
              {productDummy.filter(product => !product.is_deleted).slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="[&>div]:w-[134.4px] [&>div>div:first-child]:!w-[134.4px] [&>div>div:first-child]:!h-[201.6px]"
                >
                  <ProductCard
                    variant="viewed"
                    product={item}
                    onProductClick={() => {
                      navigate(`/product/${item.id}`);
                      onClose();
                    }}
                  />
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
