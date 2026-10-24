import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: './', // GitHub Pages 상대 경로 지원
  build: {
    outDir: 'docs', // main 브랜치 /docs 폴더로 빌드
  },
})
