# 상품 API 연동 구현 프로세스 보고서

## 📋 전체 개요

현재 프론트엔드 구조와 백엔드 API 구조를 분석하여 상품 API 연동을 위한 체계적인 구현 프로세스를 제시합니다.

---

## 🔍 현재 상황 분석

### 백엔드 API 구조
- **상품 목록**: `GET /api/v1/products/information/`
- **상품 상세**: `GET /api/v1/products/{id}`
- **카테고리별 상품**: `GET /api/v1/categories/`
- **show_fitting 파라미터**: 원본 vs 피팅 이미지 분기

### 프론트엔드 현재 구조
- **FilterContext**: 검색/필터링 상태 관리
- **CartContext**: 장바구니 상태 관리
- **React Query**: API 호출 및 캐싱
- **더미 데이터**: 현재 사용 중, 실제 API로 대체 필요

---

## 🚀 구현 프로세스 (8단계)

### 1️⃣ 타입 정의 (types/product.ts)

```typescript
// 기본 상품 정보 (목록용)
export interface Product {
  product_id: number;
  name: string;
  price: number;
  image: string;
  content: string;
}

// 상품 상세 정보
export interface ProductDetail {
  product_id: number;
  name: string;
  content: string;
  price: number;
  count: number;
  model_image: string;
  product_images: string[];
}

// API 응답 타입
export interface ProductListResponse {
  products: Product[];
}

export interface CategoryResponse {
  [categoryName: string]: Product[];
}
```

**구현 포인트:**
- 백엔드 응답 구조에 정확히 맞춤
- 기본 상품 정보와 상세 정보 분리
- 재사용 가능한 타입 구조

---

### 2️⃣ API 함수 구현 (api/products.ts)

```typescript
import axiosInstance from "./axiosInstance";

// 상품 목록 조회
export const fetchProducts = async (showFitting?: boolean): Promise<ProductListResponse> => {
  const params = showFitting !== undefined ? { show_fitting: showFitting } : {};
  const response = await axiosInstance.get<ProductListResponse>(
    "api/v1/products/information/", 
    { params }
  );
  return response.data;
};

// 상품 상세 조회
export const fetchProductDetail = async (
  productId: number, 
  showFitting?: boolean
): Promise<ProductDetail> => {
  const params = showFitting !== undefined ? { show_fitting: showFitting } : {};
  const response = await axiosInstance.get<ProductDetail>(
    `api/v1/products/${productId}`, 
    { params }
  );
  return response.data;
};

// 카테고리별 상품 조회
export const fetchCategories = async (): Promise<CategoryResponse> => {
  const response = await axiosInstance.get<CategoryResponse>("api/v1/categories/");
  return response.data;
};
```

**구현 포인트:**
- 기존 axiosInstance 재사용
- show_fitting 파라미터 옵션 처리
- 타입 안전성 보장

---

### 3️⃣ React Query 훅 구현 (hooks/useProducts.ts)

```typescript
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductDetail, fetchCategories } from "../api/products";

// 상품 목록 쿼리
export const useProductsQuery = (showFitting?: boolean) => {
  return useQuery({
    queryKey: ['products', { showFitting }],
    queryFn: () => fetchProducts(showFitting),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};

// 상품 상세 쿼리
export const useProductDetailQuery = (productId: number, showFitting?: boolean) => {
  return useQuery({
    queryKey: ['product', productId, { showFitting }],
    queryFn: () => fetchProductDetail(productId, showFitting),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// 카테고리 쿼리
export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 30 * 60 * 1000, // 30분 (카테고리는 자주 변경되지 않음)
    cacheTime: 60 * 60 * 1000, // 1시간
  });
};
```

**구현 포인트:**
- 적절한 캐싱 전략 설정
- 조건부 쿼리 (productId 존재 시에만 호출)
- 쿼리 키 최적화

---

### 4️⃣ 기존 컨텍스트 통합

**FilterContext 역할 재정의:**
```typescript
// 상태 관리만 담당 (데이터 fetching 제외)
const FilterContext = {
  inputValue: string,           // 검색어
  selectedCategory: string,     // 선택된 카테고리
  setInputValue: (value: string) => void,
  setSelectedCategory: (category: string) => void,
  handleSearch: () => void,
};

// 컴포넌트에서 사용
const MyComponent = () => {
  const { inputValue, selectedCategory } = useFilter();
  const { data: products, isLoading } = useProductsQuery(false);
  const { data: categories } = useCategoriesQuery();
  
  // 클라이언트 사이드 필터링 로직
  const filteredProducts = useMemo(() => {
    return products?.products?.filter(product => 
      product.name.includes(inputValue) && 
      (selectedCategory === '모두 보기' || product.category === selectedCategory)
    );
  }, [products, inputValue, selectedCategory]);
};
```

**구현 포인트:**
- 관심사 분리 (상태 관리 vs 데이터 fetching)
- 기존 컨텍스트 구조 유지
- 성능 최적화 (useMemo 활용)

---

### 5️⃣ 컴포넌트 구현

**ProductCard 컴포넌트:**
```typescript
interface ProductCardProps {
  product: Product;
  showFitting?: boolean;
  onAddToCart?: (productId: number) => void;
}

const ProductCard = ({ product, showFitting, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/products/${product.product_id}`);
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product.product_id);
  };
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
         onClick={handleClick}>
      <img 
        src={product.image} 
        alt={product.name}
        loading="lazy"
        className="w-full h-48 object-cover rounded-md"
      />
      <h3 className="font-semibold mt-2">{product.name}</h3>
      <p className="text-gray-600 text-sm">{product.content}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="font-bold text-lg">{product.price.toLocaleString()}원</span>
        <Button onClick={handleAddToCart} size="sm">
          장바구니
        </Button>
      </div>
    </div>
  );
};
```

**ProductList 컴포넌트:**
```typescript
const ProductList = () => {
  const { selectedCategory, inputValue } = useFilter();
  const { data: products, isLoading, error, refetch } = useProductsQuery(false);
  
  const filteredProducts = useMemo(() => {
    if (!products?.products) return [];
    
    return products.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(inputValue.toLowerCase());
      const matchesCategory = selectedCategory === '모두 보기' || 
                             product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, inputValue, selectedCategory]);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="상품을 불러오는데 실패했습니다." onRetry={refetch} />;
  if (!filteredProducts.length) return <EmptyState message="상품이 없습니다." />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map(product => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
};
```

**구현 포인트:**
- 반응형 그리드 레이아웃
- 이미지 lazy loading
- 클릭 이벤트 전파 제어
- 장바구니 연동 준비

---

### 6️⃣ 라우팅 설정

**App.tsx 라우트 추가:**
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/categories/:categoryName" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<ProductList />} />
      </Routes>
    </BrowserRouter>
  );
};
```

**Header 컴포넌트 검색 연동:**
```typescript
const Header = () => {
  const navigate = useNavigate();
  const { inputValue, setInputValue, handleSearch } = useFilter();
  
  const onSearch = () => {
    handleSearch();
    navigate(`/search?q=${encodeURIComponent(inputValue)}`);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };
  
  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder="검색"
      className="search-input"
    />
  );
};
```

**구현 포인트:**
- URL 파라미터 기반 검색
- 브라우저 히스토리 관리
- 키보드 접근성 지원

---

### 7️⃣ 에러 처리 및 로딩 상태

**공통 컴포넌트:**
```typescript
// LoadingSpinner 컴포넌트
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <Loader2 className="h-8 w-8 animate-spin" />
    <span className="ml-2">로딩 중...</span>
  </div>
);

// ErrorMessage 컴포넌트
const ErrorMessage = ({ message, onRetry }: { 
  message: string; 
  onRetry?: () => void;
}) => (
  <div className="text-center p-8">
    <p className="text-red-600 mb-4">{message}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="outline">
        다시 시도
      </Button>
    )}
  </div>
);

// EmptyState 컴포넌트
const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center p-8">
    <p className="text-gray-500">{message}</p>
  </div>
);
```

**에러 바운더리 적용:**
```typescript
// components/common/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('상품 API 에러:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorMessage message="문제가 발생했습니다. 페이지를 새로고침해주세요." />;
    }
    
    return this.props.children;
  }
}
```

**구현 포인트:**
- 일관된 에러 UI 제공
- 재시도 기능 포함
- 빈 상태 처리
- 전역 에러 바운더리

---

### 8️⃣ 테스트 및 최적화

**성능 최적화:**
```typescript
// 검색 디바운싱
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// 무한 스크롤 (선택적)
const useInfiniteProducts = () => {
  return useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 1 }) => fetchProducts(false, pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });
};
```

**테스트 체크리스트:**
- ✅ 상품 목록 렌더링 확인
- ✅ 상품 상세 페이지 이동
- ✅ 검색 기능 동작
- ✅ 카테고리 필터링
- ✅ 로딩 상태 표시
- ✅ 에러 상황 처리
- ✅ 반응형 디자인
- ✅ 접근성 확인

---

## 📊 구현 순서 요약

| 단계 | 작업 | 예상 시간 | 우선순위 |
|------|------|-----------|----------|
| 1 | 타입 정의 | 1시간 | 🔴 High |
| 2 | API 함수 구현 | 2시간 | 🔴 High |
| 3 | React Query 훅 | 1시간 | 🔴 High |
| 4 | 컨텍스트 통합 | 1시간 | 🟡 Medium |
| 5 | 컴포넌트 구현 | 4시간 | 🔴 High |
| 6 | 라우팅 설정 | 1시간 | 🟡 Medium |
| 7 | 에러 처리 | 2시간 | 🟡 Medium |
| 8 | 테스트 및 최적화 | 2시간 | 🟢 Low |

**총 예상 시간: 14시간**

---

## 🎯 핵심 성공 요소

1. **타입 안전성**: 백엔드 API 구조와 정확히 일치하는 타입 정의
2. **캐싱 전략**: React Query를 활용한 효율적인 데이터 캐싱
3. **에러 처리**: 일관된 사용자 경험을 위한 포괄적 에러 핸들링
4. **성능 최적화**: 이미지 lazy loading, 검색 디바운싱 등
5. **반응형 디자인**: 모든 디바이스에서 최적화된 UI

---

## 🔄 다음 단계 연동 계획

### Phase 2: 장바구니 API 연동
- 장바구니 추가/수정/삭제 기능 구현
- 장바구니 상태 관리 최적화
- 상품 상세 페이지에서 장바구니 연동

### Phase 3: 가상 피팅 API 연동
- 프로필 이미지 업로드 기능
- 가상 피팅 생성 및 상태 관리
- 피팅 이미지 vs 원본 이미지 전환 기능

이 프로세스를 따라 구현하면 백엔드와 완벽하게 연동되는 상품 관리 시스템을 구축할 수 있습니다.