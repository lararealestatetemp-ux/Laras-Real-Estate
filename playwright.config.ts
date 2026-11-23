import { defineConfig } from "@playwright/test";

// E2E runs against a production build (`next build` + `next start`) on a
// dedicated port so results match what visitors get and do not collide with
// a local `npm run dev` server on :3000.
const PORT = 3100;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL },
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT} --hostname 127.0.0.1`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
