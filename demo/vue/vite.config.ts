import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VitePluginSvgSpritemap from '@twirapp/vite-plugin-svg-spritemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePluginSvgSpritemap([
      './src/icons/*/*.svg',
      './src/icons/*.svg',
    ]),
  ],
})
