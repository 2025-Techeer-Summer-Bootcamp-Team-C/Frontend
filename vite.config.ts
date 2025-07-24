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
        manualChunks: {
          // React 핵심 라이브러리는 함께 유지
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI 라이브러리
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-separator',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-label',
            '@radix-ui/react-slot'
          ],
          
          // 데이터 관리 라이브러리
          'data-vendor': [
            '@tanstack/react-query',
            'axios',
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          
          // 유틸리티 (React 의존성 없는 것들만)
          'utils-vendor': [
            'clsx',
            'tailwind-merge',
            'class-variance-authority'
          ],
          
          // 애니메이션 (별도 분리)
          'animation-vendor': ['framer-motion'],
          
          // 아이콘
          'icons-vendor': ['lucide-react']
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
  },
});
