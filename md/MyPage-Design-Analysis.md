# 마이페이지 디자인 분석 및 구현 가이드

## 현재 상태 분석

### 기존 구현 상태
- **현재 구현**: 최소한의 기본 구조만 존재 (`src/pages/MyPage.tsx`)
- **현재 코드**: 중앙 정렬된 "MyPage" 제목만 표시
- **레이아웃 설정**: 인증 필요, 검색바 없음, 사용자 액션 표시, 네비게이션 없음

## 프로젝트 스타일 패턴 분석

### 1. 디자인 시스템

#### 색상 체계
- **메인 컬러**: `#000000` (검은색) - 텍스트, 버튼, 구분선
- **배경색**: `#FFFFFF` (흰색) - 기본 배경
- **보조 컬러**: `#AAAAAA` (회색) - 비활성 상태, viewed 상품
- **구분선**: `#C1BCBC` - 연한 회색 구분선
- **히어로 배경**: `#d2aaa8` - 브랜드 컬러

#### 타이포그래피
- **브랜드 폰트**: Butler (로고 전용)
- **본문 폰트**: Inter
- **텍스트 크기**:
  - 페이지 제목: `text-[20px]`
  - 소제목: `text-[16px]`
  - 본문: `text-[14px]`, `text-[13px]`
  - 소형 텍스트: `text-[10px]`, `text-[9px]`
- **폰트 두께**: `font-normal`, `font-medium`, `font-bold`

### 2. 레이아웃 패턴

#### 페이지 구조
```
Header (고정 위치)
↓
Main Content (pt-[149px] - 헤더 공간)
  ↓
  Container (mx-[112px] 또는 max-w-[1201px])
    ↓
    Title Section (mb-[48px])
    ↓
    Content Grid/List
↓
Footer (조건부 표시)
```

#### 공통 마진/패딩
- **페이지 상단**: `pt-[149px]` (헤더 높이만큼)
- **좌우 여백**: `mx-[112px]` 또는 `max-w-[1201px]`
- **섹션 간격**: `gap-[60px]`, `gap-[80px]`, `gap-[100px]`
- **카드 간격**: `gap-[80px]`, `gap-[85px]`

### 3. 컴포넌트 패턴

#### 버튼 스타일
- **기본 버튼**: 검은 배경, 흰 텍스트, hover 효과
- **아웃라인 버튼**: 흰 배경, 검은 테두리
- **크기**: `h-[44px]`, `w-[162px]` (Footer 버튼 기준)

#### 카드 컴포넌트
- **상품 카드**: `w-[240px]`, `h-[360px]` 이미지 + 정보
- **그리드**: `grid-cols-4` (4열 고정)
- **카드 정보**: 상품명, 가격, 이미지

#### 폼 스타일
- **입력 필드**: 언더라인 스타일 또는 shadcn/ui 기본
- **높이**: `h-[50px]` (로그인 폼 기준)
- **배경**: 반투명 또는 흰색

### 4. 레이아웃 패턴

#### 고정 레이아웃
- **데스크톱 중심**: 고정 너비 중심 디자인
- **그리드**: 4열 그리드 기본

## 마이페이지 디자인 제안

### 1. 기본 구조

```tsx
<div className="min-h-screen bg-white">
  {/* 헤더 공간 확보 */}
  <div className="pt-[149px] px-4 pb-8">
    <div className="mx-[112px]">
      {/* 페이지 제목 */}
      <div className="w-full mt-[30px] mb-[48px]">
        <h1 className="text-black text-lg font-inter font-normal leading-[12px]">
          마이페이지
        </h1>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="flex flex-col gap-[80px]">
        {/* 프로필 섹션 */}
        {/* 주문 내역 섹션 */}
        {/* 계정 설정 섹션 */}
      </div>
    </div>
  </div>
</div>
```

### 2. 섹션별 디자인

#### A. 프로필 섹션
```tsx
<div className="flex items-center gap-[40px] pb-[40px] border-b border-[#C1BCBC]">
  {/* 사용자 아바타 */}
  <div className="w-[80px] h-[80px] bg-gray-200 rounded-full" />
  
  {/* 사용자 정보 */}
  <div className="flex flex-col gap-2">
    <h2 className="text-black text-[20px] font-medium font-inter">
      사용자명
    </h2>
    <p className="text-[#5C5C5C] text-[14px] font-inter">
      이메일@example.com
    </p>
  </div>
  
  {/* 편집 버튼 */}
  <button className="ml-auto bg-white border border-black text-black text-[10px] font-inter py-[13px] px-[20px] hover:bg-gray-50 transition-colors">
    프로필 편집
  </button>
</div>
```

#### B. 주문 내역 섹션
```tsx
<div className="flex flex-col gap-[30px]">
  <h2 className="text-black text-[20px] font-medium font-inter">
    최근 주문 내역
  </h2>
  
  {/* 주문 아이템들 */}
  <div className="flex flex-col gap-[20px]">
    {/* OrderHistory 컴포넌트 스타일 활용 */}
  </div>
  
  {/* 전체 보기 버튼 */}
  <button 
    onClick={() => navigate('/history')}
    className="self-end text-black text-[10px] font-inter hover:opacity-70 transition-opacity"
  >
    전체 주문 내역 보기 →
  </button>
</div>
```

#### C. 계정 설정 섹션
```tsx
<div className="flex flex-col gap-[30px]">
  <h2 className="text-black text-[20px] font-medium font-inter">
    계정 설정
  </h2>
  
  {/* 설정 메뉴들 */}
  <div className="flex flex-col gap-[15px]">
    <button className="flex justify-between items-center py-[15px] px-[20px] bg-gray-50 hover:bg-gray-100 transition-colors">
      <span className="text-black text-[14px] font-inter">배송지 관리</span>
      <span className="text-[#AAAAAA] text-[12px]">→</span>
    </button>
    
    <button className="flex justify-between items-center py-[15px] px-[20px] bg-gray-50 hover:bg-gray-100 transition-colors">
      <span className="text-black text-[14px] font-inter">결제 정보</span>
      <span className="text-[#AAAAAA] text-[12px]">→</span>
    </button>
    
    <button className="flex justify-between items-center py-[15px] px-[20px] bg-gray-50 hover:bg-gray-100 transition-colors">
      <span className="text-black text-[14px] font-inter">알림 설정</span>
      <span className="text-[#AAAAAA] text-[12px]">→</span>
    </button>
  </div>
</div>
```

### 3. 활용 가능한 기존 컴포넌트

#### UI 컴포넌트
- `Button` (shadcn/ui) - 기본 버튼
- `Avatar` (shadcn/ui) - 프로필 이미지
- `Dialog` - 설정 모달
- `Form` + `Input` - 정보 수정 폼

#### 공통 컴포넌트
- `Header` - 이미 설정된 마이페이지 레이아웃
- `Footer` - 기본 푸터
- `Layout` - 페이지 래퍼

### 4. 상태 관리

#### 필요한 Context/Hook
```tsx
// 사용자 정보 관리
const { user, updateUser } = useAuth();

// 주문 내역 조회
const { getLatestOrder, getOrderHistory } = useOrder();
```

### 5. 반응형 고려사항

#### 모바일 최적화
```tsx
<div className="mx-4 lg:mx-[112px]"> // 모바일에서 좁은 여백
<div className="flex flex-col lg:flex-row gap-4 lg:gap-[40px]"> // 모바일에서 세로 배치
<h1 className="text-base lg:text-lg"> // 모바일에서 작은 텍스트
```

## 구현 우선순위

### 1단계: 기본 구조
- [x] 레이아웃 설정 확인
- [ ] 기본 페이지 구조 구현
- [ ] 프로필 섹션 구현

### 2단계: 주요 기능
- [ ] 사용자 정보 표시
- [ ] 최근 주문 내역 연동
- [ ] 주문 내역 페이지 연결

### 3단계: 고급 기능
- [ ] 프로필 편집 기능
- [ ] 계정 설정 메뉴
- [ ] 반응형 최적화

## 필요한 외부 라이브러리 조사

### UI 컴포넌트
1. **Avatar 컴포넌트**: 이미 shadcn/ui에 존재
2. **프로필 업로드**: `react-dropzone` 또는 기존 `file-upload.tsx` 활용
3. **날짜 포맷팅**: 내장 `Date` 객체 활용 (이미 OrderHistory에서 사용 중)

### 상태 관리
- 기존 Context 시스템 활용 (`useAuth`, `useOrder`)

## 접근성 고려사항

### ARIA 속성
- 프로필 이미지: `alt` 속성
- 버튼: `aria-label` 속성
- 섹션: `role` 속성

### 키보드 네비게이션
- 포커스 순서
- 탭 이동
- 엔터 키 활성화

## 성능 최적화

### 이미지 최적화
- 프로필 이미지 lazy loading
- WebP 포맷 지원

### 코드 분할
- 설정 모달 lazy loading
- 주문 내역 pagination

이 분석을 바탕으로 마이페이지를 구현하면 기존 프로젝트의 디자인 일관성을 유지하면서도 사용자 친화적인 인터페이스를 제공할 수 있습니다.