import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev: relative /api and /health calls are proxied to the Express API on :4000,
// so the frontend never hardcodes a host and cookies/credentials behave same-origin.
// Production: set VITE_API_URL; see client/.env.example.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true, // accept tunnel/preview hosts (e.g. *.e2b.app)
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
      '/health': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
  preview: { port: 4173 },
});
