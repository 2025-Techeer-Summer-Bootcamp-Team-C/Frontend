import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/common/ProductCard";
import { productDummy } from "@/dummys/productDummy";

const Home = () => {
  const navigate = useNavigate();

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const availableProducts = productDummy.filter(
    (product) => !product.is_deleted
  );

  // 상품을 4개씩 그룹화하여 행으로 나눔
  const productRows = [];
  for (let i = 0; i < availableProducts.length; i += 4) {
    productRows.push(availableProducts.slice(i, i + 4));
  }

  return (
    <div className="w-full bg-white">
      {/* Main Content */}
      <div className="flex justify-center pt-[200px] md:pt-[260px]">
        <div className="w-full max-w-[1201px] px-4 lg:px-8 xl:px-0">
          {/* Product Grid */}
          <div className="flex flex-col gap-[60px] md:gap-[80px]">
            {productRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-[80px] justify-items-center"
              >
                {row.map((product) => (
                  <ProductCard
                    key={product.product_id}
                    variant="default"
                    product={product}
                    colorOptions={3}
                    onProductClick={() =>
                      handleProductClick(product.product_id)
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
