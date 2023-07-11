import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path';
import { build, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const root = resolve(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      input: {
        popup: resolve(root, 'popup', 'popup.html'),
        option: resolve(root, 'option', 'option.html')
      },
      output: { // entry chunk assets それぞれの書き出し名の指定
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      }
    },
  }
})
