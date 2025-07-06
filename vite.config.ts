import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  // Remove the root setting - let Vite use the project root
  // root: path.resolve(__dirname, "client"), // <-- REMOVED THIS LINE
  
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    // Explicitly set the entry point
    rollupOptions: {
      input: path.resolve(__dirname, "client/index.html")
    }
  },
  server: {
    port: 5000,
    host: true,
    fs: {
      strict: false,
    },
  },
  preview: {
    port: 5000,
    host: true,
  },
});