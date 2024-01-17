import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import VitePluginSvgSpritemap from '@twir/vite-plugin-svg-spritemap'

export default defineConfig({
  build: {
    copyPublicDir: false,
    outDir: 'public',
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: './src/main.ts',
    },
  },
  plugins: [
    VitePluginSvgSpritemap(
      './../_fixtures/icons/*.svg',
      {
        prefix: 'icon-',
        injectSVGOnDev: true,
      },
    ),
    Inspect(),
  ],
})
