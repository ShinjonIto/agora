import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import path from "path";

console.log("VITE CONFIG LOADED ✅");

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    },
  },

  server: {
    proxy: {
      "/hello": "http://127.0.0.1:8000",
      "/users": "http://127.0.0.1:8000",
      "/posts": "http://127.0.0.1:8000",
    }
  }
})
