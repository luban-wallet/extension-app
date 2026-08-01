import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  define: {},
  plugins: [],
  resolve: {},
  build: {
    target: 'es2015',
    outDir: '../../dist_scripts_content',
    copyPublicDir: false,
    lib: {
      entry: [
        path.resolve(__dirname, 'src/plugins/content_scripts/content'),
        path.resolve(__dirname, 'src/plugins/content_scripts/inpage'),
      ],
      formats: ['cjs'],
      // the output file name
      fileName: (_, name) => {
        return `${name}.js`
      }
    }
  }
})
