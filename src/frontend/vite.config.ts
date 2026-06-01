import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, extname } from "path";
import { promises as fs } from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "serve-static-assets",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith("/static/")) {
            // Remove query parameters if any (e.g. ?v=1.0)
            const cleanUrl = req.url.split("?")[0];
            let filePath = resolve(__dirname, "..", "api", cleanUrl.substring(1));

            // Special local dev fallback: if looking for React public assets compiled to /static/react/
            if (cleanUrl.startsWith("/static/react/")) {
              const publicRelativePath = cleanUrl.substring("/static/react/".length);
              const testPublicPath = resolve(__dirname, "public", publicRelativePath);
              try {
                await fs.access(testPublicPath);
                filePath = testPublicPath; // Use file straight from frontend/public
              } catch (e) {
                // Not found in public, continue serving from api/static/react/
              }
            }
            try {
              const content = await fs.readFile(filePath);
              const ext = extname(filePath).toLowerCase();
              const mimeTypes: Record<string, string> = {
                ".html": "text/html",
                ".js": "text/javascript",
                ".css": "text/css",
                ".json": "application/json",
                ".png": "image/png",
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".gif": "image/gif",
                ".svg": "image/svg+xml",
                ".wav": "audio/wav",
                ".mp4": "video/mp4",
                ".woff": "application/font-woff",
                ".ttf": "application/font-ttf",
                ".eot": "application/vnd.ms-fontobject",
                ".otf": "application/font-otf",
                ".wasm": "application/wasm",
              };
              const contentType = mimeTypes[ext] || "application/octet-stream";
              res.writeHead(200, { "Content-Type": contentType });
              res.end(content);
              return;
            } catch (err) {
              // File not found or error, let it fall through
            }
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/chat": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/chat/history": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/agent": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "../api/static/react",
    emptyOutDir: true,
    manifest: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: "./src/main.tsx",
      },
      output: {
        entryFileNames: "assets/main-react-app.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "assets/main-react-app.css";
          }
          return "assets/[name][extname]";
        },
      },
    },
  },
});

