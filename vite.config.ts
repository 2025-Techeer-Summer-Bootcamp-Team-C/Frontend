import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Gzip 압축 활성화
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // 1KB 이상 파일만 압축
      deleteOriginFile: false,
    }),
    // Brotli 압축 활성화 (더 효율적)
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
    }),
    // 번들 분석기 (개발 시에만)
    ...(process.env.ANALYZE ? [visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }) as any] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // 타겟 브라우저 최적화
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
    
    rollupOptions: {
      // Tree shaking 최적화
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
      output: {
        // 효율적인 청크 분할 (React Context 이슈 해결)
        manualChunks: (id) => {
          // node_modules 처리 최적화 (React import 중복 완전 차단)
          if (id.includes('node_modules')) {
            // React 생태계 라이브러리는 모두 react-vendor로 통합
            if (id.includes('react') || 
                id.includes('react-dom') || 
                id.includes('react-router-dom') ||
                id.includes('@radix-ui') || 
                id.includes('@headlessui') ||
                id.includes('react-hook-form') || 
                id.includes('@hookform/resolvers') ||
                id.includes('lucide-react') ||
                id.includes('@tanstack/react-query')) {
              return 'react-vendor';
            }
            
            // 순수 유틸리티 (React 무관)
            if (id.includes('clsx') || 
                id.includes('tailwind-merge') || 
                id.includes('class-variance-authority') ||
                id.includes('zod') ||
                id.includes('axios')) {
              return 'utils-vendor';
            }
            
            // 기타 node_modules는 vendor로 그룹화 (React 의존성 제거)
            return 'vendor';
          }
          
          // 페이지별 청크 분할
          if (id.includes('src/pages/Home.tsx')) {
            return 'home-page';
          }
          if (id.includes('src/pages/Detail.tsx')) {
            return 'detail-page';
          }
          if (id.includes('src/pages/MyPage.tsx')) {
            return 'mypage-page';
          }
          if (id.includes('src/pages/Order.tsx') || id.includes('src/pages/Cart.tsx')) {
            return 'commerce-pages';
          }
          
          // React 관련 소스 코드는 모두 함께 그룹화 (useLayoutEffect 공유)
          if (id.includes('src/contexts/') || id.includes('src/hooks/') || id.includes('src/api/')) {
            return 'react-core';
          }
          
          // 대형 섹션 컴포넌트 분할
          if (id.includes('src/components/sections/OnBoarding.tsx') || 
              id.includes('src/components/sections/VideoSection.tsx')) {
            return 'media-sections';
          }
          if (id.includes('src/components/sections/VirtualFittingVideos.tsx')) {
            return 'fitting-sections';
          }
          
          // 다이얼로그 컴포넌트 분할
          if (id.includes('src/components/dialogs/')) {
            return 'dialog-components';
          }
          
          // ProductCard와 관련 컴포넌트
          if (id.includes('src/components/common/ProductCard.tsx') || 
              id.includes('src/components/common/CartProductCard.tsx')) {
            return 'product-components';
          }
          
          // 폼 관련 컴포넌트
          if (id.includes('src/components/forms/')) {
            return 'form-components';
          }
          
          // 기타 공통 컴포넌트
          if (id.includes('src/components/common/')) {
            return 'common-components';
          }
        },
        
        // 파일명 최적화 (캐시 무효화 방지)
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    
    // CSS 코드 스플리팅 활성화
    cssCodeSplit: true,
    
    // 소스맵 비활성화 (프로덕션 성능 향상)
    sourcemap: false,
    
    // Terser를 사용한 고급 미니피케이션
    minify: 'terser',
    terserOptions: {
      compress: {
        // 불필요한 코드 제거
        drop_console: true, // console.log 제거
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        // Dead code elimination
        dead_code: true,
        // 사용하지 않는 변수 제거
        unused: true,
      },
      mangle: {
        // 변수명 난독화로 파일 크기 감소
        safari10: true,
      },
      format: {
        // 주석 제거
        comments: false,
      },
    },
    
    // 청크 크기 최적화
    chunkSizeWarningLimit: 800, // 800KB로 경고 기준 낮춤
    
    // 어셋 인라인 임계값
    assetsInlineLimit: 4096, // 4KB 미만 파일은 base64로 인라인
    
  },
  server: {
    fs: {
      allow: ['..'],
    },
    // 개발 서버 설정 (production에서는 .gz/.br 파일이 자동 제공됨)
    cors: true,
    host: true,
    port: 5173,
  },
});
