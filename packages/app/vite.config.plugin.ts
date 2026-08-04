import path from 'path'
import { defineConfig, type UserConfig } from 'vite'

const OUT = '../../dist_plugins'
const CONFIG = {
  background: {
    build: {
      outDir: OUT,
      copyPublicDir: false,
      lib: {
        entry: path.resolve(__dirname, 'src/plugins/background_scripts/index.ts'),
        formats: ['es'],
        fileName: () => {
          return 'background.mjs'
        }
      }
    }
  },
  content: {
    build: {
      outDir: OUT,
      copyPublicDir: false,
      lib: {
        entry: path.resolve(__dirname, 'src/plugins/content_scripts/content.ts'),
        formats: ['umd'],
        name: 'LBContent',
        fileName: () => {
          return 'content.js'
        }
      }
    }
  },
  inpage: {
    build: {
      outDir: OUT,
      copyPublicDir: false,
      lib: {
        entry: path.resolve(__dirname, 'src/plugins/content_scripts/inpage.ts'),
        formats: ['umd'],
        name: 'LBInpage',
        fileName: () => {
          return 'inpage.js'
        }
      }
    }
  }
}

export default defineConfig(() => {
  const flag = process.env.FLAG as keyof typeof CONFIG
  const config = CONFIG[flag] as UserConfig
  return config
})

