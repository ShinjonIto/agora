import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  base: "/",  

  plugins: [
    react(),
    svgr(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  // dev 用（build では無視される）
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8000",
    },
  },
});
