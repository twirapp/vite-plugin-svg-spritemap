import { parse } from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'
import { SVGManager } from '../svgManager'
import type { Options, Pattern } from '../types'
import { getSpritemapPath } from '../helpers/spritemapPath'

export default function VuePlugin(iconsPattern: Pattern, options: Options): Plugin {
  const filterVueComponent = /\.svg\?(use|view)?$/
  let svgManager: SVGManager
  let config: ResolvedConfig

  return <Plugin>{
    name: 'vite-plugin-svg-spritemap:vue',
    enforce: 'pre',
    configResolved(_config) {
      config = _config
      if (config.plugins.findIndex(plugin => plugin.name === 'vite:vue') === -1 || !options.output)
        return
      svgManager = new SVGManager(iconsPattern, options, config)
      svgManager.updateAll()
    },
    async load(id) {
      if (config.plugins.findIndex(plugin => plugin.name === 'vite:vue') === -1 || !options.output)
        return
      if (!id.match(filterVueComponent))
        return

      const [path, query] = id.split('?', 2)
      const { name, base: filename } = parse(path)
      const folderPrefix = path.split('/').at(-2)
      const svgName = `${folderPrefix}-${name}`
      const svg = svgManager.svgs.get(svgName)
      const spritemapPath = getSpritemapPath(config)

      let source = ''

      if (query === 'view') {
        const width = svg?.width ? `width="${Math.ceil(svg.width)}"` : ''
        const height = svg?.width ? `height="${Math.ceil(svg.height)}"` : ''
        source = `<img src="${spritemapPath}#${svgName}-view" ${[width, height].filter(item => item.length > 0).join(' ')}/>`
      }
      else {
        source = `<svg><slot/><use xlink:href="${spritemapPath}#${svgName}"></use></svg>`
      }

      const { compileTemplate } = await import('vue/compiler-sfc')
      const { code } = compileTemplate({
        id,
        source,
        filename,
        transformAssetUrls: false,
      })

      return `${code}\nexport default { render: render }`
    },
  }
}
