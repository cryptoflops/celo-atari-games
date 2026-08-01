import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: '../../',
  resolve: {
    alias: {
      // The local game-engine publishes as @cryptoflops/celo-atari-games, but the
      // web app imports it as @celo-arcade/game-engine (workspace dep name).
      // Alias the bare specifier to the source so Vite can resolve it without a
      // pre-built dist/ and without renaming the package.
      '@celo-arcade/game-engine': fileURLToPath(
        new URL('../../packages/game-engine/src/index.ts', import.meta.url)
      ),
    },
  },
})
