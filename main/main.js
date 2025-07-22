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
  session,
  desktopCapturer,
  webFrame,
} = require('electron');

const path = require('path');
const positioner = require('electron-traywindow-positioner');

const devMode = app.commandLine.hasSwitch('dev');

const webstratesURL = 'https://videoplayground.xyz/frontpage/';
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

// function createControlPanel() {
//   // Create the window that opens on app start
//   // and tray click
//   controlWindow = new BaseWindow({
//     parent: roomWindow,
//     title: 'Control Panel',
//     // webPreferences: {
//     //   preload: path.join(__dirname, 'preloadTray.js'),
//     // },
//     width: 360,
//     height: 360,
//     show: true,
//     // frame: false,
//     autoHideMenuBar: true,
//     setVisibleOnAllWorkspaces: true,
//     // transparent: true,
//     // skipTaskbar: true,
//     hasShadow: false,
//     // resizable: false,
//     // modal: true,
//   });

//   // preventRefresh(trayWindow);

//   trayView = new WebContentsView({
//     webPreferences: {
//       preload: path.join(__dirname, 'preloadTray.js'),
//     }
//   });
//   trayView.webContents.loadFile('tray_simple.html');
//   trayView.setBounds({ x: 0, y: 0, width: 290, height: 300 })
//   trayWindow.contentView.addChildView(trayView);

//   trayWindow.on('blur', () => {
//     // trayWindow.hide();
//   });
//   trayWindow.on('show', () => {
//     // positioner.position(trayWindow, tray.getBounds());
//     trayWindow.focus();
//   });
//   trayView.webContents.once('dom-ready', () => {
//     trayWindow.show();
//   });
//   trayView.webContents.on('new-window', (e, url) => {
//     e.preventDefault();
//     shell.openExternal(url);
//   });

//   trayWindow.on('closed', () => {
//     trayView.webContents.close()
//   })
// }

function createTrayWindow() {
  // Create the window that opens on app start
  // and tray click
  trayWindow = new BaseWindow({
    parent: roomWindow,
    title: 'Call Window',
    // webPreferences: {
    //   preload: path.join(__dirname, 'preloadTray.js'),
    // },
    width: 320,
    height: 360,
    show: false,
    // frame: false,
    autoHideMenuBar: true,
    setVisibleOnAllWorkspaces: true,
    // transparent: true,
    // skipTaskbar: true,
    hasShadow: false,
    resizable: false,
    // modal: true,
  });

  preventRefresh(trayWindow);

  trayView = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, 'preloadTray.js'),
    }
  });
  trayView.webContents.loadFile('tray_simple.html');
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

function createWebstratesWindow() {
  // Create the window that opens on app start
  // and tray click
  webstratesWindow = new BaseWindow({
    title: 'Video Playground',
    width: 1280,
    height: 960,
    fullscreen: true,
    frame: false,
    // autoHideMenuBar: false,
    transparent: true,
    // skipTaskbar: true,
    hasShadow: false,
    // resizable: false,
    // Don't show the window until the user is in a call.
    // show: false,
  });

  webstratesView = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, 'preloadCall.js'),
    }
  });
  webstratesView.webContents.loadURL(webstratesURL);
  webstratesView.webContents.setBackgroundThrottling(false);
  webstratesView.setBounds({ x: 0, y: 0, width: webstratesWindow.getBounds().width, height: webstratesWindow.getBounds().height })
  webstratesWindow.contentView.addChildView(webstratesView);

  if (devMode) {
    // roomWindow.show();
    // webstratesView.webContents.openDevTools();
    // roomView.webContents.openDevTools();
  }

  webstratesView.webContents.setZoomFactor(1.0);

  // Upper Limit is working of 500 %
  webstratesView.webContents
      .setVisualZoomLevelLimits(1, 5)
      .then(console.log("Zoom Levels Have been Set between 100% and 500%"))
      .catch((err) => console.log(err));

  webstratesView.webContents.on("zoom-changed", (event, zoomDirection) => {
      console.log(zoomDirection);
      var currentZoom = webstratesView.webContents.getZoomFactor();
      console.log("Current Zoom Factor - ", currentZoom);
      // console.log('Current Zoom Level at - '
      // , win.webContents.getZoomLevel());
      console.log("Current Zoom Level at - ", webstratesView.webContents.zoomLevel);

      if (zoomDirection === "in") {
        
          // win.webContents.setZoomFactor(currentZoom + 0.20);
          webstratesView.webContents.zoomFactor = currentZoom + 0.1;

          console.log("Zoom Factor Increased to - "
                      , webstratesView.webContents.zoomFactor * 100, "%");
      }
      if (zoomDirection === "out") {
        
          // win.webContents.setZoomFactor(currentZoom - 0.20);
          webstratesView.webContents.zoomFactor = currentZoom - 0.1;

          console.log("Zoom Factor Decreased to - "
                      , webstratesView.webContents.zoomFactor * 100, "%");
      }
  });


  
  // roomView.addChildView(webstrateView);

  webstratesWindow.on('will-resize', (e, newBounds, details) => {
    webstratesView.setBounds({ x: 0, y: 0, width: newBounds.width, height: newBounds.height });
    // roomView.setBounds({ x: 0, y: 0, width: newBounds.width, height: newBounds.height });
  })
  webstratesWindow.on('resize', () => {
    webstratesView.setBounds({ x: 0, y: 0, width: webstratesWindow.getBounds().width, height: webstratesWindow.getBounds().height });
    // roomView.setBounds({ x: 0, y: 0, width: roomView.getBounds().width, height: roomView.getBounds().height });
  })
  webstratesWindow.on('enter-fullscreen', () => {
    webstratesView.setBounds({ x: 0, y: 0, width: webstratesWindow.getBounds().width, height: webstratesWindow.getBounds().height });
    // roomView.setBounds({ x: 0, y: 0, width: roomView.getBounds().width, height: roomView.getBounds().height });
  })
  webstratesWindow.on('exit-fullscreen', () => {
    webstratesView.setBounds({ x: 0, y: 0, width: webstratesWindow.getBounds().width, height: webstratesWindow.getBounds().height });
    // roomView.setBounds({ x: 0, y: 0, width: roomView.getBounds().width, height: roomView.getBounds().height });
  })
  webstratesWindow.on('closed', () => {
    webstratesView.webContents.close()
    roomView.webContents.close()
  })
}

function createRoomWindow() {
  // Create the browser window.
  roomWindow = new BaseWindow({
    parent: webstratesWindow,
    title: 'Video Overlay',
    // useContentSize: true,
    // width: 1280,
    // height: 960,
    fullscreen: true,
    frame: false,
    autoHideMenuBar: false,
    transparent: true,
    skipTaskbar: true,
    hasShadow: false,
    // resizable: false,
    // Don't show the window until the user is in a call.
    // show: false,
  });
  // roomWindow = new BaseWindow({ width: 800, height: 400 })

  // preventRefresh(roomWindow);
  
  // roomView.setBackgroundColor("#0FFF") // hex ARGB transparent background
  // console.log(roomWindow.getBounds().width)
  // roomView.webContents.loadFile('index.html');

  // and load the index.html of the app.
  roomView = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, 'preloadCall.js'),
    }
  });
  roomView.webContents.loadFile('index.html');
  roomView.webContents.setBackgroundThrottling(false);
  roomView.setBackgroundColor("#00000000");
  roomView.setBounds({ x: 0, y: 0, width: roomWindow.getBounds().width, height: roomWindow.getBounds().height })
  
  // roomView.addChildView(webstrateView);
  roomWindow.contentView.addChildView(roomView);

  // roomWindow.on('will-resize', (e, newBounds, details) => {
  //   roomView.setBounds({ x: 0, y: 0, width: newBounds.width, height: newBounds.height });
  // })
  // roomWindow.on('resize', () => {
  //   roomView.setBounds({ x: 0, y: 0, width: roomWindow.getBounds().width, height: roomWindow.getBounds().height });
  // })
  // roomWindow.on('enter-fullscreen', () => {
  //   roomView.setBounds({ x: 0, y: 0, width: roomWindow.getBounds().width, height: roomWindow.getBounds().height });
  // })
  // roomWindow.on('exit-fullscreen', () => {
  //   roomView.setBounds({ x: 0, y: 0, width: roomWindow.getBounds().width, height: roomWindow.getBounds().height });
  // })
  roomWindow.on('closed', () => {
    roomView.webContents.close()
    trayView.webContents.close()
  })

  if (devMode) {
    // roomWindow.show();
    // webstratesView.webContents.openDevTools();
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

  // roomWindow.setAlwaysOnTop(true, level);

  // roomWindow.on('focus', () => {
  //   roomWindow.title = 'focused';
  //   // mousePos = screen.getCursorScreenPoint();
  //   // console.log(mousePos);
  //   // roomWindow.transparent = false;
  //   // roomWindow.setAlwaysOnTop(true, level);
  // });

  // roomWindow.on('blur', () => {
  //   roomWindow.title = 'blurred';
  //   // roomWindow.transparent = true;
  //   // roomWindow.setAlwaysOnTop(false, level);
  // });

  // const view1 = new WebContentsView()
  // roomWindow.contentView.addChildView(view1)
  // view1.webContents.loadURL('https://electronjs.org')
  // view1.setBounds({ x: 0, y: 0, width: 400, height: 400 })

  // const view2 = new WebContentsView()
  // roomWindow.contentView.addChildView(view2)
  // view2.webContents.loadURL('https://github.com/electron/electron')
  // view2.setBounds({ x: 400, y: 0, width: 400, height: 400 })
  // view1.webContents.openDevTools();

  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
      // Grant access to the first screen found.
      callback({ video: sources[0], audio: 'loopback' })
    })
    // If true, use the system picker if available.
    // Note: this is currently experimental. If the system picker
    // is available, it will be used and the media request handler
    // will not be invoked.
  }, { useSystemPicker: true })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWebstratesWindow();
  createRoomWindow();
  createTrayWindow();
  setupTray();
})

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
  // if (app.dock) {
  //   app.dock.hide();
  // }

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
  // roomWindow.hide();
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

ipcMain.handle('request-sync', (e, args) => {
  // webstratesView.webContents.postMessage("messageData test", "https://videoplayground.xyz/EtHMdPJbR/");
  // webstratesView.webContents.executeJavaScript("addWindow();");
  // webstratesView.webContents.postMessage("messageData test", webstratesView.webContents.getURL());
  // console.log(webstratesView.webContents.getURL());
  var webstrateClientId;
  webstratesView.webContents.executeJavaScript('webstrate.clientId', true)
  .then((result) => {
    webstrateClientId = result;
    console.log(webstrateClientId);

    webstratesView.webContents.executeJavaScript('document.getElementById("participantView-"+webstrate.clientId).style.height', true)
      .then((result) => {
        console.log(result)
      });
  });
  
});

ipcMain.handle('request-presets', (e, args) => {
  // webstratesView.webContents.executeJavaScript("openSettings();");
  webstratesView.webContents.executeJavaScript("setupRoomPreset(1);");
});
ipcMain.handle('request-edit', (e, args) => {
  webstratesView.webContents.executeJavaScript("toggleEdit();");
});
ipcMain.handle('refresh-page', (e, args) => {
  webstratesView.webContents.reload();
});