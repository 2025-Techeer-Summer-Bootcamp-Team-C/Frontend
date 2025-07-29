# 프론트엔드 기술 스택 분석

## 핵심 프레임워크 & 라이브러리

- **React 19.1.0** - 최신 React 버전의 사용자 인터페이스 라이브러리
- **TypeScript 5.8.3** - JavaScript의 정적 타입 확장 언어
- **Vite 7.0.3** - 빠른 빌드 도구 및 개발 서버
- **React Router DOM 7.6.3** - React 애플리케이션의 클라이언트 사이드 라우팅

## UI 및 스타일링

- **Tailwind CSS 4.1.11** - 유틸리티 우선 CSS 프레임워크
- **Framer Motion 12.23.9** - React용 프로덕션 레디 모션 라이브러리
- **shadcn/ui with Radix UI** - 접근성을 고려한 React 컴포넌트 라이브러리
- **Lucide React 0.525.0** - 아름다운 오픈소스 아이콘 라이브러리
- **Class Variance Authority 0.7.1** - TypeScript용 조건부 CSS 클래스 유틸리티
- **clsx 2.1.1** & **Tailwind Merge 3.3.1** - CSS 클래스 조건부 결합 및 병합 도구

## 폼 및 데이터 검증

- **React Hook Form 7.60.0** - React용 성능 최적화된 폼 라이브러리
- **Zod 4.0.5** - TypeScript 우선 스키마 검증 라이브러리
- **@hookform/resolvers 5.1.1** - React Hook Form과 검증 라이브러리 연결

## 상태 관리 및 데이터 페칭

- **TanStack React Query 5.82.0** - 서버 상태 관리 라이브러리
- **React Context** - React 내장 전역 상태 관리
- **Axios 1.10.0** - HTTP 클라이언트 라이브러리

## 특수 기능 라이브러리

- **React Dropzone 14.3.8** - 파일 드래그 앤 드롭 업로드 컴포넌트
- **React Daum Postcode 3.2.0** - 다음 우편번호 서비스 React 컴포넌트
- **React Intersection Observer 9.16.0** - Intersection Observer API React 훅
- **Sonner 2.0.6** - React용 토스트 알림 라이브러리

## 개발 도구 및 빌드 최적화

- **ESLint 9.30.1** - JavaScript/TypeScript 코드 품질 도구
- **TypeScript ESLint 8.35.1** - TypeScript용 ESLint 플러그인
- **@vitejs/plugin-react 4.6.0** - Vite React 플러그인
- **Vite Plugin Compression 0.5.1** - Gzip/Brotli 압축 플러그인
- **Vite Plugin PWA 1.0.1** - Progressive Web App 지원
- **Rollup Plugin Visualizer 6.0.3** - 번들 사이즈 분석 도구
- **Vite Bundle Analyzer 1.1.0** - 번들 분석기

## 배포 및 모니터링

- **Vercel Analytics 1.5.0** - Vercel 플랫폼용 웹 분석 도구
- **Compression 1.8.1** - Node.js 압축 미들웨어

## 타입 정의

- **@types/react 19.1.8** - React TypeScript 타입 정의
- **@types/react-dom 19.1.6** - React DOM TypeScript 타입 정의
- **@types/node 24.0.12** - Node.js TypeScript 타입 정의
- **@types/compression 1.8.1** - Compression 라이브러리 타입 정의

## 커스텀 폰트

- **Butler Black** - 브랜드 헤딩용 커스텀 폰트
- **Pretendard ExtraLight** - 본문 텍스트용 한글 폰트

## 프로젝트 구조 특징

- **모듈화된 컴포넌트 구조** - UI, 공통, 섹션, 폼, 다이얼로그별 분리
- **Context 기반 상태 관리** - 장바구니, 필터, 피팅, 모달, 주문 상태 관리
- **커스텀 훅 활용** - 재사용 가능한 로직 추상화
- **TypeScript 타입 시스템** - 엄격한 타입 정의로 런타임 에러 방지
- **성능 최적화** - 코드 스플리팅, 트리 쉐이킹, 압축 등 적용