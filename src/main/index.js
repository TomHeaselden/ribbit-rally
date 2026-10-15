// Ribbit Rally desktop app: opens the game in its own window.
import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'

// Let the music and engine sounds start without needing an extra click
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 560,
    title: 'Ribbit Rally',
    backgroundColor: '#3b1d8f',
    icon: join(__dirname, '../renderer/icon.png'),
    autoHideMenuBar: true, // on Windows/Linux press Alt to show the menu
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  win.once('ready-to-show', () => win.show())

  // "npm run dev" serves the page with live reload; the built app loads the bundled file
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Web links open in the normal browser, never inside the game window
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url)
    return { action: 'deny' }
  })
  win.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('file:') || url.startsWith(process.env['ELECTRON_RENDERER_URL'] || '\0')) return
    event.preventDefault()
    if (/^https?:/i.test(url)) shell.openExternal(url)
  })

  // F11 toggles full screen on every platform
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') {
      win.setFullScreen(!win.isFullScreen())
      event.preventDefault()
    }
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
