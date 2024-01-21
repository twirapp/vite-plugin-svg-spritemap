import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import VitePluginSvgSpritemap from '@twirapp/vite-plugin-svg-spritemap'

export default defineConfig({
  plugins: [
    sveltekit(),
    VitePluginSvgSpritemap(
      './../_fixtures/icons/*.svg',
      {
        styles: './../_fixtures/scss/spritemap.scss',
        prefix: 'icon-',
      },
    ),
  ],
})
