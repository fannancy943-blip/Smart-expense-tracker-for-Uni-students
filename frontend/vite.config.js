import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const portPlugin = {
  name: 'log-port',
  configResolved(config) {
    const port = config.server.port || 5173
    const https = config.server.https ? 'https' : 'http'
    
    if (config.command === 'serve') {
      console.log(`\n${'='.repeat(50)}`)
      console.log(`🎨 UniTracker Frontend`)
      console.log(`${'='.repeat(50)}`)
      console.log(`🌐 Local:   ${https}://localhost:${port}`)
      console.log(`📡 API:     http://localhost:5000/api`)
      console.log(`${'='.repeat(50)}\n`)
    }
  }
}

export default defineConfig({
  plugins: [react(), portPlugin],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})

