import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint(), // O plugin agora deve encontrar o eslint.config.js automaticamente
  ],
});
