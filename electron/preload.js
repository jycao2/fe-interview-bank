// Electron preload：按需暴露安全桥接 API 给渲染进程
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // 当前运行环境标识（渲染进程可据此调整 UX，如隐藏「在新窗口打开」）
  isElectron: true,
  versions: {
    node: process.versions.node,
    electron: process.versions.electron
  }
})
