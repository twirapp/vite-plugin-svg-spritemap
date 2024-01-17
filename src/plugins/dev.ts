import type { Plugin, ResolvedConfig } from 'vite'
import fg from 'fast-glob'
import { SVGManager } from '../svgManager'
import type { Options, Pattern } from '../types'
import { getSpritemapPath } from '../helpers/spritemapPath'

const event = 'vite-plugin-svg-spritemap:update'

export default function DevPlugin(iconsPattern: Pattern, options: Options): Plugin {
  const filterSVG = /\.svg$/
  const virtualModuleId = '/@vite-plugin-svg-spritemap/client'
  let svgManager: SVGManager
  let config: ResolvedConfig
  let spritemapPath: string

  return <Plugin>{
    name: 'vite-plugin-svg-spritemap:dev',
    apply: 'serve',
    configResolved(_config) {
      config = _config
      svgManager = new SVGManager(iconsPattern, options, config)
      spritemapPath = getSpritemapPath(_config)
    },
    resolveId(id) {
      if (id === virtualModuleId)
        return id
    },
    load(id) {
      if (id === virtualModuleId)
        return generateHMR()
    },
    async buildStart() {
      await svgManager.updateAll()

      const icons = await fg(iconsPattern)
      const directories: Set<string> = new Set()
      icons.forEach((icon) => {
        const directory = icon.split('/').slice(0, -1).join('/')
        directories.add(directory)
      })

      directories.forEach(directory => this.addWatchFile(directory))
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith(spritemapPath)) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'image/svg+xml')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.write(svgManager.spritemap, 'utf-8')
          res.end()
        }
        else {
          next()
        }
      })
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        html = html.replace(
          /__spritemap-\d*|__spritemap/g,
          `__spritemap__${svgManager.hash}`,
        )

        return html.replace(
          '</body>',
          `<script type="module" src="${virtualModuleId}"></script></body>`,
        )
      },
    },
    async handleHotUpdate(ctx) {
      if (!ctx.file.match(filterSVG))
        return

      await svgManager.update(ctx.file)

      ctx.server.ws.send({
        type: 'custom',
        event,
        data: {
          id: svgManager.hash,
          spritemap: '',
        },
      })
    },
  }

  // TODO: fix hmr
  function generateHMR() {
    const updateElements = `
    const elements = document.querySelectorAll(
      '[src*=${spritemapPath}], [href*=${spritemapPath}], [*|href*=${spritemapPath}]'
    )

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i]
      const attributes = ['xlink:href', 'href', 'src']
      for (const attr of attributes) {
        if (!el.hasAttribute(attr)) continue
        const value = el.getAttribute(attr)
        if (!value) continue
        const newValue = value.replace(
          ${spritemapPath}.*#/g,
          '__spritemap__' + data.id + '#'
        )
        el.setAttribute(attr, newValue)
      }
    }`

    return `console.debug('[vite-plugin-svg-spritemap]', 'connected.')
      if (import.meta.hot) {
        import.meta.hot.on('${event}', data => {
          console.debug('[vite-plugin-svg-spritemap]', 'update')
          ${updateElements}
        })
      }`
  }
}
