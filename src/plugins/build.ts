import path from 'node:path'
import type { ExternalOption } from 'rollup'
import type { Plugin, ResolvedConfig } from 'vite'
import type { Options, Pattern } from '../types'
import { SVGManager } from '../svgManager'
import { getFileName } from '../helpers/filename'
import { getSpritemapPath } from '../helpers/spritemapPath'

export default function BuildPlugin(iconsPattern: Pattern, options: Options): Plugin {
  let config: ResolvedConfig
  let fileRef: string
  let fileName: string
  let svgManager: SVGManager
  let spritemapPath: string

  return <Plugin>{
    name: 'vite-plugin-svg-spritemap:build',
    apply: 'build',
    configResolved(_config) {
      config = _config
      svgManager = new SVGManager(iconsPattern, options, config)
      spritemapPath = getSpritemapPath(_config)
    },
    async buildStart() {
      await svgManager.updateAll()

      if (typeof options.output === 'object') {
        fileName = getFileName(
          options.output.filename,
          'spritemap',
          svgManager.spritemap,
          'svg',
        )
        const filePath = path.join(config.build.assetsDir, fileName)
        fileRef = this.emitFile({
          needsCodeReference: false,
          name: options.output.name,
          source: svgManager.spritemap,
          type: 'asset',
          fileName: filePath,
        })
      }
    },
    transform(code) {
      if (typeof options.output !== 'object' || code.indexOf(spritemapPath) === -1)
        return

      // prevent sveltekit rewrite
      const base = config.base.startsWith('.')
        ? config.base.substring(1)
        : config.base

      const filePath = path.posix.join(base, this.getFileName(fileRef))

      return {
        code: code.replaceAll(spritemapPath, filePath),
        map: null,
      }
    },
  }
}
