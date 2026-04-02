import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose on LAN (e.g., for mobile access on same WiFi)
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
