import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Inspect from 'vite-plugin-inspect'
import customBuild from './plugins/vite-plugin-build'

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
/** @type {import('vite').UserConfig} */
// https://vitejs.dev/config/
const pathSrc = fileURLToPath(new URL('./src', import.meta.url))
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    customBuild(),
    AutoImport({
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon'
        })
      ],
      dts: pathSrc + '/auto-imports.d.ts'
    }),
    Components({
      resolvers: [
        IconsResolver({
          enabledCollections: ['carbon']
        }),
        ElementPlusResolver()
      ],
      dts: pathSrc + '/components.d.ts'
    }),
    Icons({
      autoInstall: true
    }),
    Inspect()
  ],
  resolve: {
    alias: {
      '@': pathSrc
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    host: 'localhost',
    port: 3200,
    strictPort: true,
    proxy: {
      '/api/renderCard': {
        target: 'http://localhost:3000',
        changeOrigin: true
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/api/cardImage': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/api/Authenticate': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/api/uploadInfoSubmit': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/api/uploadImage': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/api/uploadFile': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      'api/removeCardInServer': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: '../My-Space-server/public',
    rollupOptions: {}
  }
})
