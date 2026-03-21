import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

export default defineConfig({
  root: 'public/frontend',
  plugins: [createVuePlugin()],
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})
