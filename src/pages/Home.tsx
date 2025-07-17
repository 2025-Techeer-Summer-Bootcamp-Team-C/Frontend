import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/common/ProductCard";
import { productDummy } from "@/dummys/productDummy";
import { categoryDummy } from "@/dummys/categoryDummy";
import { useFilter } from "@/contexts/FilterContext";

const Home = () => {
  const navigate = useNavigate();
  const { searchQuery, selectedCategory } = useFilter();

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const availableProducts = productDummy.filter(
    (product) => !product.is_deleted
  );

  // 검색어와 카테고리로 상품 필터링
  const filteredProducts = availableProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 카테고리 매칭: category_id를 통해 카테고리 이름 찾기
    const productCategory = categoryDummy.find(cat => cat.id === product.category_id)?.name;
    const matchesCategory = selectedCategory === "모두 보기" || productCategory === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // 필터링된 상품을 4개씩 그룹화하여 행으로 나눔
  const productRows = [];
  for (let i = 0; i < filteredProducts.length; i += 4) {
    productRows.push(filteredProducts.slice(i, i + 4));
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
                    key={product.id}
                    variant="default"
                    product={product}
                    onProductClick={() => handleProductClick(product.id)}
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
