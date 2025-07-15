import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/common/ProductCard";

// 더미 상품 데이터
const dummyProducts = [
  {
    id: 1,
    name: "클래식 화이트 티셔츠",
    price: 29000,
    imageUrl: "",
    colorOptions: 3,
  },
  {
    id: 2,
    name: "데님 재킷",
    price: 89000,
    imageUrl: "",
    colorOptions: 2,
  },
  {
    id: 3,
    name: "블랙 슬림 팬츠",
    price: 59000,
    imageUrl: "",
    colorOptions: 4,
  },
  {
    id: 4,
    name: "스트라이프 셔츠",
    price: 45000,
    imageUrl: "",
    colorOptions: 1,
  },
  {
    id: 5,
    name: "캐주얼 후디",
    price: 69000,
    imageUrl: "",
    colorOptions: 5,
  },
  {
    id: 6,
    name: "트렌치 코트",
    price: 159000,
    imageUrl: "",
    colorOptions: 2,
  },
  {
    id: 7,
    name: "니트 스웨터",
    price: 79000,
    imageUrl: "",
    colorOptions: 3,
  },
  {
    id: 8,
    name: "클래식 스니커즈",
    price: 89000,
    imageUrl: "",
    colorOptions: 6,
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="w-full bg-white">
      {/* Main Content */}
      <div className="flex justify-center pt-[200px] md:pt-[260px]">
        <div className="w-full max-w-[1201px] px-4 lg:px-8 xl:px-0">
          {/* Product Grid */}
          <div className="flex flex-col gap-[60px] md:gap-[80px]">
            {/* First Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-[80px] justify-items-center">
              {dummyProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  variant="default"
                  productName={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  colorOptions={product.colorOptions}
                  onProductClick={() => handleProductClick(product.id)}
                />
              ))}
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-[80px] justify-items-center">
              {dummyProducts.slice(4, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  variant="default"
                  productName={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  colorOptions={product.colorOptions}
                  onProductClick={() => handleProductClick(product.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
