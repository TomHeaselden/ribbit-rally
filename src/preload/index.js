// Runs before the game page loads. It only tells the page that it's running as the desktop app;
// the game itself needs no special access to the computer.
import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('ribbitRally', {
  desktop: true,
  platform: process.platform
})
