import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  define: {},
  plugins: [],
  resolve: {},
  build: {
    target: 'es2015',
    outDir: '../../dist_scripts_background',
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/plugins/background_scripts/index'),
      formats: ['es'],
      fileName: () => {
        return 'background.mjs'
      }
    }
  }
})
