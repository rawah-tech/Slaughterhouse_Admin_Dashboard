import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  // Chartist 0.11's UMD build uses `this || global`; ESM makes `this`
  // undefined, so map only that legacy global identifier to the browser.
  define: {
    global: "globalThis",
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    css: true,
    clearMocks: true,
    restoreMocks: true,
  },
});
