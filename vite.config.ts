import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { publicBlogContent } from './build/public-blog.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [publicBlogContent(), react()],
})
