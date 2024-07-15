import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import commonjs from '@rollup/plugin-commonjs'; // Import the plugin
import path from 'path';

export default defineConfig({
  plugins: [
    reactRefresh(),
    commonjs(), // Use the plugin
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['tailwindcss/lib/index.js'], // Optimize the dependency
  },
  css: {
    // Your CSS configuration
  },
});
