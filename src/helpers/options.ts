import type { Options, UserOptions } from '../types'

export function createOptions(options: UserOptions = {}): Options {
  // Default svgo options
  let svgo: Options['svgo'] = {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
            removeEmptyAttrs: false,
            moveGroupAttrsToElems: false,
            collapseGroups: false,
          },
        },
      },
    ],
  }
  if (typeof options.svgo === 'object' || options.svgo === false)
    svgo = options.svgo

  let output: Options['output'] = {
    filename: '[name].[hash][extname]',
    name: 'spritemap.svg',
    use: true,
    view: true,
  }
  if (options.output === false) {
    output = false
  }
  else if (typeof options.output === 'string') {
    output.filename = options.output
  }
  else if (typeof options.output === 'object') {
    output = {
      filename: options.output.filename || output.filename,
      name: options.output.name || output.name,
      use:
        typeof options.output.use !== 'undefined'
          ? options.output.use
          : true,
      view:
        typeof options.output.view !== 'undefined'
          ? options.output.view
          : true,
    }
  }

  return {
    svgo,
    output,
  } satisfies Options
}
