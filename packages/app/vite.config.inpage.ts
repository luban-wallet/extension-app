import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../../dist_scripts_content',
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/plugins/content_scripts/inpage.ts'),
      formats: ['umd'],
      name: 'LBInpage',
      // the output file name
      fileName: () => {
        return 'inpage.js'
      }
    }
  }
})
