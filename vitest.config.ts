import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Unit tests for the pure parts: the door's tokens and hashes, the spoken
 * length, the palette index. Components are verified in the browser (see
 * README, Verifying), not here.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
