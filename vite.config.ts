import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { PRODUCTS } from './src/data/products'
import { CARD_BEHAVIORS } from './src/api/payment'

function apiMockPlugin(): Plugin {
  return {
    name: 'api-mock',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/products', (_req: IncomingMessage, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(PRODUCTS))
      })

      server.middlewares.use('/api/payment', (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          const { cardNumber } = JSON.parse(body) as { cardNumber: string }
          const stripped = cardNumber.replace(/\s/g, '')
          const behavior = CARD_BEHAVIORS[stripped] ?? 'success'

          setTimeout(() => {
            res.setHeader('Content-Type', 'application/json')
            if (behavior === 'error') {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Internal Server Error' }))
            } else if (behavior === 'declined') {
              res.statusCode = 402
              res.end(JSON.stringify({ status: 'declined' }))
            } else {
              res.statusCode = 200
              res.end(JSON.stringify({ status: 'success', orderId: `ORD-${Date.now()}` }))
            }
          }, 1500)
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    apiMockPlugin(),
  ],
  base: '/Lab.qa/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
