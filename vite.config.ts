import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://swis2.trade.kg',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api/v2'),
          headers: {
            Authorization:
              'Basic ' +
              Buffer.from(`${env.VITE_API_USER}:${env.VITE_API_PASS}`).toString('base64'),
          },
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              proxyRes.headers['access-control-allow-origin'] = '*'
              proxyRes.headers['access-control-allow-headers'] =
                'authorization, content-type, accept'
              proxyRes.headers['access-control-allow-methods'] = 'get, options'
            })
          },
        },
      },
    },
  }
})
