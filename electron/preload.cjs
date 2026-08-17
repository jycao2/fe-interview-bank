// Electron preload（.cjs 显式 CommonJS，避免 package.json "type":"module" 冲突）
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  versions: {
    node: process.versions.node,
    electron: process.versions.electron
  }
})
