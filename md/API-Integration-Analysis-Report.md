# API 연동 분석 및 계획 보고서

## 개요

이 보고서는 Django REST Framework 기반 백엔드와 React TypeScript 프론트엔드 간의 API 연동 현황을 분석하고, 개선 방안을 제시합니다.

## 1. 백엔드 API 구조 분석

### 1.1 API 엔드포인트 구조

#### User 관련 API (`/api/v1/users/`)
- `POST /users/signup` - 회원가입 (multipart/form-data)
- `POST /users/login` - 로그인
- `POST /users/logout` - 로그아웃
- `POST /users/token/refresh` - 토큰 갱신
- `POST /users/cart` - 장바구니 상품 추가
- `GET /users/cart/list` - 장바구니 목록 조회
- `PUT /users/cart/<int:cart_product_id>` - 장바구니 상품 수량 수정
- `DELETE /users/cart/<int:cart_product_id>` - 장바구니 상품 삭제
- `PATCH /users/profile-image` - 프로필 이미지 변경
- `GET /users/images` - 사용자 이미지 목록 조회

#### Product 관련 API (`/api/v1/products/`)
- `GET /products/` - 상품 목록 조회
- `POST /products/` - 상품 등록 (관리자 전용)
- `GET /products/<int:product_id>` - 상품 상세 조회
- `POST /products/<int:product_id>/images` - 상품 이미지 다중 업로드
- `GET /products/<int:product_id>/images/<user_image>` - 상품별 가상 피팅 이미지 조회

#### Order 관련 API (`/api/v1/orders/`)
- `POST /orders/single/` - 단일 상품 주문 생성
- `POST /orders/cart/` - 장바구니 상품 주문 생성

#### Fitting 관련 API (`/api/v1/fittings/`)
- `POST /fittings/images` - 가상 피팅 작업 예약 (퀄리티 낮음)
- `POST /fittings/images/edit-bg-white` - 이미지 배경 흰색 편집
- `POST /fittings/images/detail` - 가상 피팅 작업 예약 (퀄리티 높음)
- `POST /fittings/<int:product_id>/videos/<int:user_image_id>` - 가상 피팅 영상 생성 요청
- `GET /fittings/<int:product_id>/videos/<int:user_image_id>` - 가상 피팅 영상 상태 조회
- `POST /fittings/images/detail/mock` - 목 데이터로 가상 피팅 테스트

#### Category 관련 API (`/api/v1/categories/`)
- 백엔드에는 구현되어 있으나 URL 설정 누락

### 1.2 인증 시스템
- JWT 기반 인증 (Access Token + Refresh Token)
- Cookie 기반 토큰 저장
- 토큰 자동 갱신 메커니즘

### 1.3 주요 모델 구조

#### User 모델
```python
class User(AbstractUser):
    username: CharField (unique)
    created_at: DateTimeField
    updated_at: DateTimeField
    deleted_at: DateTimeField
    is_fitting: BooleanField
    profile_image: CharField
```

#### Product 모델
```python
class Product(models.Model):
    category: ForeignKey(Category)
    name: CharField
    content: TextField
    price: IntegerField
    count: IntegerField
    image: CharField
    is_deleted: BooleanField
```

#### CartItem 모델
```python
class CartItem(models.Model):
    user: ForeignKey(User)
    product: ForeignKey(Product)
    quantity: PositiveIntegerField
    created_at: DateTimeField
```

#### FittingResult 모델
```python
class FittingResult(models.Model):
    user_image: ForeignKey(UserImage)
    product: ForeignKey(Product)
    status: CharField (pending/processing/completed/failed)
    image: CharField
    video: CharField
```

## 2. 프론트엔드 현재 상태 분석

### 2.1 API 클라이언트 구조

#### 구현된 API 함수들
- **auth.ts**: signUp, login, logout
- **users.ts**: getUserImages
- **products.ts**: fetchProducts, fetchProductDetail, fetchCategories
- **cartItems.ts**: fetchCartList, addCartItem, removeCartItem, updateCartItem
- **orders.ts**: createSingleOrder, createCartOrder
- **fittings.ts**: startFittingDetail, generateFittingVideo, getFittingVideoStatus

#### 타입 정의 현황
- **user.ts**: User, UserImage, SignUp/Login/Logout 관련 타입
- **product.ts**: Product, ProductDetail, Category 관련 타입
- **cart.ts**: CartResponse, CartItemResponse 관련 타입
- **order.ts**: Order 관련 타입 (누락)

### 2.2 구현 완료된 기능
1. 회원가입/로그인/로그아웃
2. 상품 목록/상세 조회
3. 장바구니 CRUD 
4. 단일/장바구니 주문 생성
5. 가상 피팅 (상세 버전)
6. 가상 피팅 영상 생성

## 3. API 연동 문제점 및 개선 방안

### 3.1 현재 문제점

#### 1. 응답 데이터 구조 불일치
**문제**: 백엔드 응답과 프론트엔드 타입 정의가 일치하지 않음

**백엔드 응답 예시:**
```json
// 장바구니 목록 - 백엔드
{
  "cart_product": [
    {
      "id": 1,
      "user": 1,
      "product": {...},
      "quantity": 2
    }
  ],
  "total_price": 50000
}

// 상품 목록 - 백엔드  
{
  "products": [
    {
      "product_id": 1,
      "name": "상품명",
      "price": 25000,
      "image": "url",
      "content": "설명"
    }
  ]
}
```

**프론트엔드 기대 타입:**
```typescript
// 장바구니 - 프론트엔드
interface CartResponse {
  cart_product: {
    cart_product_id: number; // 실제로는 'id'
    product_id: number;      // 실제로는 'product' 객체
    name: string;            // product 객체 내부에 있음
    price: number;           // product 객체 내부에 있음
    quantity: number;
    image: string;           // product 객체 내부에 있음
  }[];
  total_price: number;
}
```

#### 2. 누락된 API 구현
- Category 관련 API URL 매핑 누락
- 사용자 프로필 정보 조회 API 부재
- 주문 내역 조회 API 부재

#### 3. 인증 토큰 관리 불일치
- 백엔드: Cookie 기반 토큰 저장
- 프론트엔드: localStorage 기반 토큰 관리

#### 4. 파일 업로드 처리
- 일부 API는 multipart/form-data 사용
- 타입 정의에서 File 타입 처리 미흡

### 3.2 타입 정의 개선 방안

#### 1. 백엔드 응답에 맞는 타입 재정의
```typescript
// 수정된 CartResponse
interface CartResponse {
  cart_product: {
    id: number;
    user: number;
    product: {
      id: number;
      name: string;
      price: number;
      image: string;
      content: string;
    };
    quantity: number;
    created_at: string;
  }[];
  total_price: number;
}

// 변환 함수 추가
export const transformCartResponse = (response: BackendCartResponse): FrontendCartData => {
  return {
    cart_product: response.cart_product.map(item => ({
      cart_product_id: item.id,
      product_id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    })),
    total_price: response.total_price,
  };
};
```

#### 2. 누락된 타입 추가
```typescript
// Order 관련 타입
export interface OrderItem {
  id: number;
  order: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

export interface Order {
  id: number;
  user: number;
  status: 'ORDERED' | 'CANCELLED';
  created_at: string;
  items: OrderItem[];
  total_price: number;
}

// Category 타입
export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string | null;
  is_deleted: boolean | null;
}
```

### 3.3 API 함수 개선 방안

#### 1. 에러 처리 표준화
```typescript
// 공통 에러 타입
export interface APIError {
  status: number;
  message: string;
  details?: any;
}

// 에러 처리 유틸리티
export const handleAPIError = (error: any): APIError => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data.error || error.response.data.message || 'API 요청 실패',
      details: error.response.data,
    };
  }
  return {
    status: 500,
    message: '네트워크 오류가 발생했습니다.',
  };
};
```

#### 2. 인증 토큰 관리 개선
```typescript
// Cookie 기반 토큰 관리로 변경
export const authAPI = {
  login: async (data: LoginRequest) => {
    const response = await axiosInstance.post('/api/v1/users/login', data);
    // Cookie에서 자동으로 토큰이 설정되므로 localStorage 사용하지 않음
    return response.data;
  },
  
  refreshToken: async () => {
    const response = await axiosInstance.post('/api/v1/users/token/refresh');
    return response.data;
  },
  
  logout: async () => {
    const response = await axiosInstance.post('/api/v1/users/logout');
    // Cookie에서 자동으로 토큰이 제거됨
    return response.data;
  },
};
```

## 4. 백엔드 수정 제안사항

### 4.1 응답 데이터 구조 개선

#### 1. 일관된 응답 형식 적용
```python
# 표준 응답 형식
{
    "status": "success" | "error",
    "message": "응답 메시지",
    "data": {...},  # 실제 데이터
    "errors": {...} # 에러 상세 (에러 시에만)
}
```

#### 2. 장바구니 API 응답 개선
```python
# 현재 백엔드 응답
{
    "cart_product": [...],
    "total_price": 50000
}

# 개선된 응답 (프론트엔드와 일치)
{
    "cart_products": [
        {
            "cart_product_id": 1,
            "product_id": 123,
            "name": "상품명",
            "price": 25000,
            "quantity": 2,
            "image": "url"
        }
    ],
    "total_price": 50000
}
```

### 4.2 누락된 API 구현

#### 1. Category URL 매핑 추가
```python
# config/urls.py에 추가
path('categories/', include('category.urls')),
```

#### 2. 사용자 프로필 조회 API 추가
```python
# user/urls.py에 추가
path('profile', UserProfileAPI.as_view(), name='user-profile'),

# user/views.py에 추가
class UserProfileAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "profile_image": user.profile_image,
            "is_fitting": user.is_fitting,
            "created_at": user.created_at,
        })
```

#### 3. 주문 내역 조회 API 추가
```python
# order/urls.py에 추가
path('history/', OrderHistoryView.as_view(), name='order-history'),

# order/views.py에 추가
class OrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related('items__product')
        # 직렬화 및 응답 로직
```

## 5. 구현 우선순위 및 작업 계획

### Phase 1: 긴급 수정 사항 (1-2일)
1. **백엔드 응답 데이터 구조 통일**
   - CartItem Serializer 수정
   - Product Serializer 수정
   - 표준 응답 형식 적용

2. **프론트엔드 타입 정의 수정**
   - 백엔드 응답에 맞게 타입 재정의
   - API 함수에서 데이터 변환 로직 추가

3. **인증 시스템 통일**
   - 프론트엔드에서 localStorage 제거
   - Cookie 기반 인증으로 통일

### Phase 2: 기능 보완 (3-5일)
1. **누락된 API 구현**
   - Category API URL 매핑
   - 사용자 프로필 조회 API
   - 주문 내역 조회 API

2. **에러 처리 개선**
   - 표준화된 에러 응답 형식
   - 프론트엔드 에러 처리 로직 개선

3. **타입 안전성 강화**
   - 누락된 타입 정의 추가
   - API 응답 검증 로직 추가

### Phase 3: 최적화 및 개선 (5-7일)
1. **API 성능 최적화**
   - N+1 쿼리 문제 해결
   - 응답 데이터 최적화

2. **테스트 코드 작성**
   - API 엔드포인트 테스트
   - 타입 안전성 테스트

3. **문서화**
   - API 명세서 업데이트
   - 프론트엔드 개발 가이드 작성

## 6. 예상 리스크 및 대응 방안

### 6.1 데이터 호환성 문제
**리스크**: 백엔드 응답 구조 변경 시 기존 프론트엔드 코드 오류
**대응**: 점진적 마이그레이션을 위한 버전 관리 및 변환 레이어 구현

### 6.2 인증 시스템 변경
**리스크**: Cookie 기반 인증 변경 시 인증 상태 관리 복잡성 증가
**대응**: 인증 상태 관리를 위한 전용 Context 및 Hook 구현

### 6.3 성능 영향
**리스크**: API 응답 구조 변경으로 인한 성능 저하
**대응**: 응답 데이터 최적화 및 캐싱 전략 수립

## 7. 결론

현재 백엔드와 프론트엔드 간의 API 연동에서 주요 문제점은 응답 데이터 구조의 불일치와 일부 API의 누락입니다. 이를 해결하기 위해서는:

1. **백엔드**: 일관된 응답 형식 적용 및 누락된 API 구현
2. **프론트엔드**: 타입 정의 수정 및 데이터 변환 로직 추가
3. **공통**: 인증 시스템 통일 및 에러 처리 표준화

제안된 3단계 계획을 통해 체계적으로 개선하면 안정적이고 유지보수가 용이한 API 연동 구조를 구축할 수 있을 것입니다.