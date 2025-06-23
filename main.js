const { app, BrowserWindow, globalShortcut, powerMonitor } = require('electron');
const path = require('path');

let win;

async function loadURLWithRetry(url, retries = 5, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await win.loadURL(url);
      return;
    } catch (err) {
      console.error(`加载失败 (尝试 ${i + 1}/${retries}):`, err);
      if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
    }
  }
  console.error('加载页面最终失败，退出应用');
  app.quit();
}

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    frame: false,
    kiosk: true,
    fullscreen: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,  // 必须为true
      devTools: true,
      sandbox: true, 
      webSecurity: true, 
      allowRunningInsecureContent: false
    }
  });

  if (process.env.NODE_ENV === 'development') {
    loadURLWithRetry('http://localhost:3002');
  } else {
    const indexPath = path.join(__dirname, 'build', 'index.html');
    console.log('加载路径:', indexPath);
    win.loadFile(indexPath).catch(err => {
      console.error('加载静态文件失败:', err);
      app.quit();
    });
  }

  win.setMinimumSize(1024, 768);

  globalShortcut.registerAll(['CommandOrControl+R', 'Alt+Tab', 'Alt+F4', 'F5', 'F11', 'F12', 'Super+L'], () => {
    return false;
  });

  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    if (process.env.ADMIN_PASSWORD === 'your_secure_password') {
      app.quit();
    }
  });

  // 每秒检查闲置时间，60秒后显示锁屏
  setInterval(() => {
    const idleTime = powerMonitor.getSystemIdleTime();
    if (idleTime >= 60) {
      win.webContents.send('show-lock-screen');
    } else {
      win.webContents.send('hide-lock-screen');
    }
  }, 1000);
  globalShortcut.registerAll(['CommandOrControl+R', 'Alt+Tab'], () => {
    return false;
  });

  win.on('close', (event) => {
    event.preventDefault();
  });

  win.on('blur', () => {
    win.focus();
  });



app.whenReady().then(() => {
  console.log('Electron app ready');
  console.log('NODE_ENV:', process.env.NODE_ENV); // [!code ++]
  console.log('启动路径:', __dirname); 
  createWindow();
}).catch(err => {
  console.error('启动失败:', err);
  process.exit(1); // [!code ++]
});

// 添加进程错误监听
process.on('uncaughtException', (err) => { // [!code ++]
  console.error('未捕获异常:', err); // [!code ++]
}); // [!code ++]

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.setAsDefaultProtocolClient('bank-electron');

app.on('open-url', (event, url) => {
  event.preventDefault();
  if (win) {
    win.loadURL(url);
  }
});}