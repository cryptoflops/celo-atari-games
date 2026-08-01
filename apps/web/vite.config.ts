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
      // The game-engine package publishes as @cryptoflops/celo-atari-games, but
      // the web app imports it as @celo-atari-games/gas-gobbler-engine (and a few
      // call-sites still reference the older @celo-arcade/game-engine spec).
      // Alias both bare specifiers to the local source so Vite resolves them
      // without a pre-built dist/ and without renaming the package.
      '@celo-atari-games/gas-gobbler-engine': fileURLToPath(
        new URL('../../packages/game-engine/src/index.ts', import.meta.url)
      ),
      '@celo-arcade/game-engine': fileURLToPath(
        new URL('../../packages/game-engine/src/index.ts', import.meta.url)
      ),
    },
  },
})
