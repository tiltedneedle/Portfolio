import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Unit tests for the pure parts (the door's tokens and hashes, the spoken
 * length, the week, the palette index) and for small components rendered
 * to static markup (the inline-mark scanner). Pages are verified in the
 * browser (see README, Verifying), not here.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
