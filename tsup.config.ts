import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  shims: true,
  dts: true,
  async onSuccess() {
    await fs.copyFile(
      resolve(__dirname, './src/client.d.ts'),
      resolve(__dirname, 'dist/client.d.ts')
    )
  },
})
