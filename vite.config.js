import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteMockServe } from 'vite-plugin-mock'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteMockServe({
      mockPath: "src/mock",
      localEnabled: true,
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/HelloKitty_bg.jpg',
          dest: 'assets'
        }
      ]
    })
  ],
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
