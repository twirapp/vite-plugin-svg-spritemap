import type { ResolvedConfig } from 'vite'

export function getSpritemapPath(config: ResolvedConfig) {
  const envDir = config.envDir?.split('/').at(-1) || 'default'
  const basePath = config.base || '/'
  return `${basePath}spritemap-${envDir}`
}
