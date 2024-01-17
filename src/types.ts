import type { Config as SvgoConfig } from 'svgo'

export type Pattern = string[] | string

export interface UserOptions {
  /**
   * Take an SVGO Options object. If true, it will use the default SVGO preset, if false, it will disable SVGO optimization
   * @see https://github.com/svg/svgo#default-preset
   * @default true
   */
  svgo?: boolean | SvgoConfig
  /**
   * Output spritemap options.
   * Set as a string to change the destination of the file. You can use output filename like Rollup (doesn't support hash number).
   * Set to false to disable output generation
   * @default true
   */
  output?:
    | Partial<OptionsOutput>
    | string
    | boolean
}

export interface OptionsOutput {
  /**
   * The destination of the file. You can use output filename like Rollup. Note: Doesn't support hash number.
   * @see https://www.rollupjs.org/guide/en/#outputassetfilenames
   * @default '[name].[hash][extname]'
   */
  filename: string
  /**
   * The name of file, appear on the manifest key
   * @default spritemap.svg
   */
  name: string
  /**
   * Insert use element in the spritemap
   * @default true
   */
  use: boolean
  /**
   * Insert view element in the spritemap
   * @default true
   */
  view: boolean
}

export interface Options {
  svgo: SvgoConfig | false
  output: OptionsOutput | false
}

export interface SvgMapObject {
  /**
   * The interpreted width attribute of the svg
   */
  width: number
  /**
   * The interpreted height attribute of the svg
   */
  height: number
  /**
   * The interpreted viewbox attribute of the svg
   */
  viewBox: number[]
  /**
   * The filepath of the svg
   */
  filePath: string
  /**
   * The source code of the svg
   */
  source: string
}
