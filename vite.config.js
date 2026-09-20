import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'lucide-react', 'clsx', 'tailwind-merge'],
          'household-data': ['./src/data/processed/household_archive.json'],
          'spotify-data': ['./src/data/processed/spotify_archive.json'],
          'transact-data': ['./src/data/processed/indiatransact_archive.json']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
