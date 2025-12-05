
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Executa o ESLint no momento da construção e do desenvolvimento
    eslint({
      cache: false, // Desativa o cache para garantir que sempre pegue as novas regras
      include: ['src/**/*.js', 'src/**/*.jsx'], // Analisa apenas arquivos dentro da pasta src
      exclude: ['/node_modules/**'],
      failOnWarning: false, // Continua o build mesmo com avisos
      failOnError: false, // Continua o build mesmo com erros (útil para dev)
    }),
  ],
});
