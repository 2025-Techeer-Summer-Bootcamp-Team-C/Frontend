import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 관련 라이브러리를 별도 청크로 분리
          vendor: ['react', 'react-dom', 'react-router-dom'],
          
          // UI 라이브러리를 별도 청크로 분리
          ui: [
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
          
          // 데이터 관련 라이브러리
          data: [
            '@tanstack/react-query',
            'axios',
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          
          // 개발 도구 (프로덕션에서 제외됨)
          devtools: [
            '@tanstack/react-query-devtools'
          ],
          
          // 애니메이션 및 유틸리티
          utils: [
            'framer-motion',
            'clsx',
            'tailwind-merge',
            'class-variance-authority'
          ],
          
          // 아이콘 라이브러리
          icons: [
            'lucide-react'
          ]
        },
      },
    },
    cssCodeSplit: true,
    sourcemap: false, // 프로덕션에서 소스맵 비활성화
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000, // 청크 크기 경고 임계값 (KB)
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
});
