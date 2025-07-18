import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/common/ProductCard";
import { useFilter } from "@/contexts/FilterContext";
// import { useProductsQuery } from "@/hooks/useProducts";
import { useMemo } from "react";
import { useProductsQuery } from "@/hooks/useProducts";

const Home = () => {
  const navigate = useNavigate();
  const { searchQuery } = useFilter();
  const { data: products } = useProductsQuery();
  // const { data: categories } = useCategoriesQuery();
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const availableProducts = useMemo(() => products?.products ?? [], [products]);
  // 검색어와 카테고리로 상품 필터링
  const filteredProducts = useMemo(
    () =>
      availableProducts?.filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        // 카테고리 매칭: category_id를 통해 카테고리 이름 찾기
        // const productCategory = categories?.find(cat => cat.categoryName === product.category_name)?.name;
        // const matchesCategory = selectedCategory === "모두 보기" || productCategory === selectedCategory;

        return matchesSearch;
      }),
    [availableProducts, searchQuery]
  );

  // 필터링된 상품을 4개씩 그룹화하여 행으로 나눔
  const productRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < filteredProducts?.length; i += 4) {
      rows.push(filteredProducts?.slice(i, i + 4));
    }
    return rows;
  }, [filteredProducts]);

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

      {/* 피팅하기 플로팅 버튼 */}
      <button className="fixed bottom-6 right-6 bg-black text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-colors z-50 font-inter text-sm">
        피팅하기
      </button>
    </div>
  );
};

export default Home;
