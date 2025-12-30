import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { copyFileSync } from "fs";

// Plugin to copy index.html to 404.html for GitHub Pages SPA routing
const githubPagesPlugin = () => ({
  name: "github-pages-404",
  closeBundle() {
    copyFileSync(
      path.resolve(__dirname, "dist/index.html"),
      path.resolve(__dirname, "dist/404.html")
    );
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    githubPagesPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Ensure redirect files are copied to dist
  publicDir: "public",
}));
