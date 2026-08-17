// Electron 主进程（CommonJS，适配 type:module 包）
// 开发环境：Vite 开发服务器 http://localhost:5173
// 生产环境：加载 Vite 构建产物 dist/index.html（file:// 协议）
const { app, BrowserWindow, shell, Menu } = require('electron')
const path = require('path')

const isDev = !app.isPackaged

// 限制单实例（避免重复启动）
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
  return
}

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    title: '前端面试题库',
    backgroundColor: '#1a1a1a',
    icon: getIconPath(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      // 允许 localStorage / IndexedDB 等本地存储
      webSecurity: true
    }
  })

  // 菜单栏（开发可见；生产自动隐藏）
  if (isDev) {
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      {
        label: '开发',
        submenu: [
          { label: '刷新', role: 'reload' },
          { label: '强制刷新', role: 'forceReload' },
          { label: '开发者工具', role: 'toggleDevTools' },
          { type: 'separator' },
          { label: '全屏', role: 'togglefullscreen' }
        ]
      }
    ]))
  }

  mainWindow.once('ready-to-show', () => mainWindow.show())

  // 外链在系统浏览器打开，不走应用窗口
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
  mainWindow.webContents.on('will-navigate', (e, url) => {
    const host = new URL(url).hostname
    if (host && !['localhost', '127.0.0.1', ''].includes(host)) {
      e.preventDefault()
      shell.openExternal(url)
    }
  })

  // 开发模式 -> Vite dev server
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    // 生产模式 -> dist/index.html
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

// 优先选择可用的图标；没有时 Electron 使用默认
function getIconPath() {
  try {
    const fs = require('fs')
    const p = path.join(__dirname, '..', 'build', 'icon.png')
    if (fs.existsSync(p)) return p
    return undefined
  } catch (_) {
    return undefined
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
