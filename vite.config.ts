import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dev-only: serve both pages at the same clean URLs Netlify rewrites to in
// production (/explore -> index.html, /map -> map.html). Has no effect on builds.
function cleanUrls(): Plugin {
  return {
    name: "clean-urls",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url) {
          const [pathname, search] = req.url.split("?");
          if (pathname === "/explore") req.url = `/index.html${search ? `?${search}` : ""}`;
          else if (pathname === "/map") req.url = `/map.html${search ? `?${search}` : ""}`;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cleanUrls()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        map: path.resolve(__dirname, "map.html"),
      },
    },
  },
});
