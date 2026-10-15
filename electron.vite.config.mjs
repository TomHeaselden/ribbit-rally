// Build setup for Ribbit Rally (electron-vite).
//   npm run dev      -> opens the game in Electron with live reload while you edit
//   npm run build    -> builds everything into out/ (main, preload and the game page)
//   npm run dist     -> builds, then packages installers for this computer into release/
import { defineConfig } from 'electron-vite'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const GAME_DIR = resolve(process.cwd(), 'src/renderer/game')
// Load order matters: tracks -> 3D renderer -> music -> game logic
const GAME_SCRIPTS = ['tracks.js', 'render3d.js', 'music.js', 'game.js']

// The game is written as plain browser scripts that share one global scope (they call each
// other's functions directly), so rather than bundling them as ES modules we inline them,
// in order, as one classic <script> at the GAME_SCRIPTS marker in index.html.
function inlineGameScripts() {
  return {
    name: 'ribbit-rally:inline-game-scripts',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const code = GAME_SCRIPTS.map((f) => readFileSync(resolve(GAME_DIR, f), 'utf8')).join('\n')
        if (/<\/script/i.test(code)) throw new Error('A game script contains "</script", which would break the page')
        const tag = `<script>\n${code}\n</script>`
        const marker = '<!-- GAME_SCRIPTS -->'
        // (a replacer function, so "$" characters in the game code are kept as-is)
        return html.includes(marker) ? html.replace(marker, () => tag) : html.replace('</body>', () => `${tag}\n</body>`)
      }
    },
    // While running "npm run dev", reload the window whenever a game script is saved
    configureServer(server) {
      server.watcher.add(GAME_DIR)
      server.watcher.on('change', (file) => {
        if (file.startsWith(GAME_DIR)) server.ws.send({ type: 'full-reload' })
      })
    }
  }
}

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    plugins: [inlineGameScripts()]
  }
})
