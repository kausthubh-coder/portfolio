import { defineConfig } from "astro/config";

export default defineConfig({
  prefetch: true,
  devToolbar: {
    enabled: false,
  },
  vite: {
    server: {
      hmr: false,
      // Fail instead of drifting onto the next port, which may be another worktree's.
      strictPort: true,
    },
  },
});
