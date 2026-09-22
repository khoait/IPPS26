// vite.config.ts
import { defineConfig } from "vite";
import { basename, resolve, dirname } from "path";
import { readdirSync } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const librariesDir = resolve(__dirname, "src/libraries");

const input = Object.fromEntries(
  readdirSync(librariesDir)
    .filter((file) => file.endsWith("Library.ts") && !file.endsWith(".d.ts"))
    .map((file) => [basename(file, ".ts"), resolve(librariesDir, file)]),
);

export default defineConfig(({ mode }) => ({
  root: "src",
  build: {
    outDir: "../ipps_/casemanagement/js",
    emptyOutDir: true,
    // Don't minify development builds
    minify: mode === 'production',
    // Generate source maps for browser debugging
    sourcemap: mode === 'development' ? 'inline' : false,
    rollupOptions: {
      input,
      output: {
        entryFileNames: "[name].js",
        format: "iife",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // Optional alias for cleaner imports
    },
  },
  // define: {
  //   "process.env.NODE_ENV": '"production"', // Inject environment variables
  // },
}));
