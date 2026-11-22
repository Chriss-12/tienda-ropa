import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    base: '/tienda-ropa/',
  plugins: [react()],

  build: {
    minify: "terser",
    sourcemap: false,

    terserOptions: {
      compress: {
        dead_code: true,
        drop_debugger: true,
        passes: 2,
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
  },
});
