// Modules to control application life and create native browser window
const {
  app,
  screen,
  remote,
  BaseWindow,
  BrowserWindow,
  WebContentsView,
  ipcMain,
  Tray,
  Menu,
  MenuItem,
  shell,
  globalShortcut,
  webContents,
} = require('electron');

const path = require('path');
const positioner = require('electron-traywindow-positioner');

const devMode = app.commandLine.hasSwitch('dev');

// const ll = require('leader-line');

let roomWindow = null;
let trayWindow = null;
let roomView = null;
let trayView = null;
let tray = null;
let mousePos = null;

// app.on('ready', () => {
//   let mousePos = screen.getCursorScreenPoint();
//   console.log(mousePos);
// });

function createTrayWindow() {
  // Create the window that opens on app start
  // and tray click
  trayWindow = new BaseWindow({
    parent: roomWindow,
    title: 'Call Window',
    // webPreferences: {
    //   preload: path.join(__dirname, 'preloadTray.js'),
    // },
    width: 290,
    height: 300,
    // show: false,
    frame: false,
    autoHideMenuBar: true,
    setVisibleOnAllWorkspaces: true,
    transparent: true,
    // skipTaskbar: true,
    hasShadow: false,
  });

  preventRefresh(trayWindow);

  trayView = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, 'preloadTray.js'),
    }
  });
  trayView.webContents.loadFile('tray.html');
  trayView.setBounds({ x: 0, y: 0, width: 290, height: 300 })
  trayWindow.contentView.addChildView(trayView);

  trayWindow.on('blur', () => {
    // trayWindow.hide();
  });
  trayWindow.on('show', () => {
    // positioner.position(trayWindow, tray.getBounds());
    trayWindow.focus();
  });
  trayView.webContents.once('dom-ready', () => {
    trayWindow.show();
  });
  trayView.webContents.on('new-window', (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });

  trayWindow.on('closed', () => {
    trayView.webContents.close()
  })
}

function createRoomWindow() {
  // Create the browser window.
  roomWindow = new BaseWindow({
    title: 'Shared Overlay',
    width: 800,
    height: 400,
    fullscreen: true,
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    // skipTaskbar: true,
    hasShadow: false,
    // Don't show the window until the user is in a call.
    // show: false,
  });
  // roomWindow = new BaseWindow({ width: 800, height: 400 })

  preventRefresh(roomWindow);

  // and load the index.html of the app.
  roomView = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, 'preloadCall.js'),
    }
  });
  roomView.setBackgroundColor("#0FFF") // hex ARGB transparent background
  console.log(roomWindow.getBounds().width)
  roomView.webContents.loadFile('index.html');
  roomView.setBounds({ x: 0, y: 0, width: roomWindow.getBounds().width, height: roomWindow.getBounds().height })
  roomWindow.contentView.addChildView(roomView);

  roomWindow.on('will-resize', (e, newBounds, details) => {
    roomView.setBounds({ x: 0, y: 0, width: newBounds.width, height: newBounds.height });
  })
  roomWindow.on('resize', () => {
    roomView.setBounds({ x: 0, y: 0, width: roomWindow.getBounds().width, height: roomWindow.getBounds().height });
  })
  roomWindow.on('enter-fullscreen', () => {
    roomView.setBounds({ x: 0, y: 0, width: roomWindow.getBounds().width, height: roomWindow.getBounds().height });
  })
  roomWindow.on('exit-fullscreen', () => {
    roomView.setBounds({ x: 0, y: 0, width: roomWindow.getBounds().width, height: roomWindow.getBounds().height });
  })
  roomWindow.on('closed', () => {
    roomView.webContents.close()
    trayView.webContents.close()
  })

  if (devMode) {
    roomWindow.show();
    roomView.webContents.openDevTools();
  } else {
    roomWindow.setIgnoreMouseEvents(true, { forward: true });
  }
  roomWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  let level = 'normal';
  // Mac OS requires a different level for our drag/drop and overlay
  // functionality to work as expected.
  if (process.platform === 'darwin') {
    level = 'floating';
  }

  roomWindow.setAlwaysOnTop(true, level);

  roomWindow.on('focus', () => {
    roomWindow.title = 'focused';
    // mousePos = screen.getCursorScreenPoint();
    // console.log(mousePos);
    // roomWindow.transparent = false;
    // roomWindow.setAlwaysOnTop(true, level);
  });

  roomWindow.on('blur', () => {
    roomWindow.title = 'blurred';
    // roomWindow.transparent = true;
    // roomWindow.setAlwaysOnTop(false, level);
  });

  // const view1 = new WebContentsView()
  // roomWindow.contentView.addChildView(view1)
  // view1.webContents.loadURL('https://electronjs.org')
  // view1.setBounds({ x: 0, y: 0, width: 400, height: 400 })

  // const view2 = new WebContentsView()
  // roomWindow.contentView.addChildView(view2)
  // view2.webContents.loadURL('https://github.com/electron/electron')
  // view2.setBounds({ x: 400, y: 0, width: 400, height: 400 })
  // view1.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createRoomWindow();
  createTrayWindow();
  setupTray();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// setupTray creates the system tray where our application will live.
function setupTray() {
  if (app.dock) {
    app.dock.hide();
  }

  tray = new Tray(path.join(__dirname, '../assets/tray.png'));
  setupTrayMenu(false);

  tray.setToolTip('Daily');
  tray.setIgnoreDoubleClickEvents(true);
  tray.on('click', () => {
    if (trayWindow.isVisible()) {
      trayWindow.hide();
      return;
    }
    trayWindow.show();
  });
  tray.on('right-click', () => {
    tray.popUpContextMenu(tray.contextMenu);
  });
}

function setupTrayMenu(inCall) {
  const menuItems = [];

  // If the user is in a call, allow them to leave the call
  // via the context menu
  if (inCall) {
    const item = new MenuItem({
      label: 'Leave Call',
      type: 'normal',
      click() {
        roomView.webContents.send('leave-call');
      },
    });
    menuItems.push(item);
  }
  const exitItem = new MenuItem({
    label: 'Quit',
    type: 'normal',
    click() {
      app.quit();
    },
  });
  menuItems.push(exitItem);

  const contextMenu = Menu.buildFromTemplate(menuItems);
  tray.contextMenu = contextMenu;
}

// Redirect any refresh shortcuts, since we don't want the user to
// accidentally drop out of the call.
function preventRefresh(window) {
  window.on('focus', () => {
    globalShortcut.register('CommandOrControl+R', () => { });
    globalShortcut.register('CommandOrControl+Shift+R', () => { });
    globalShortcut.register('F5', () => { });
  });
  window.on('blur', () => {
    globalShortcut.unregisterAll(window);
  });
}

// Our custom API handlers are defined below.

// When a user fills in the call form from the tray window,
// this handler will send the room URL and the user's chosen
// name to the call window.
ipcMain.handle('join-call', (e, url, name) => {
  roomView.webContents.send('join-call', { url, name });
});

// When we get a success or failure status from the call
// window when joining a call, this handler will send
// the failure (if any) to the tray window, OR alternatively
// maximize and focus the call window.
ipcMain.handle('call-join-update', (e, joined) => {
  if (!joined) {
    trayView.webContents.send('join-failure');
    trayWindow.show();
    return;
  }
  roomWindow.maximize();
  setupTrayMenu(true);
  roomWindow.show();
  roomWindow.focus();
});

// When a user leaves a call, this handler will update
// the tray menu and send the event to the tray window
// (so that the tray window can be updated to show the
// join form once more)
ipcMain.handle('left-call', () => {
  setupTrayMenu(false);
  trayView.webContents.send('left-call');
  roomWindow.hide();
});

// This handler updates our mouse event settings depending
// on whether the user is hovering over a clickable element
// in the call window.
ipcMain.handle('set-ignore-mouse-events', (e, ...args) => {
  // const win = BrowserWindow.fromWebContents(e.sender);
  roomWindow.setIgnoreMouseEvents(...args);
});

ipcMain.handle('close-app', () => {
  app.quit();
});
