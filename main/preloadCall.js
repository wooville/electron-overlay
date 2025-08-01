const { contextBridge, ipcRenderer } = require('electron');

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
//   refreshClickableElements();
// });

// window.addEventListener('DOMNodeInserted', () => {
//   refreshClickableElements();
// });

// refreshClickableElements finds all DOM elements which can be clicked
// and adds listeners to detect mouse enter and leave events. When the user
// is hovering over a clickable element, we will get Electron to stop
// ignoring mouse events by default. When a mouse leaves a clickable element,
// we'll set the app to ignore mouse clicks once more (to let the user
// interact with background applications)
// function refreshClickableElements() {
//   const clickableElements = document.getElementsByClassName('clickable');
//   const listeningAttr = 'listeningForMouse';
//   for (let i = 0; i < clickableElements.length; i += 1) {
//     const ele = clickableElements[i];
//     // If the listeners are already set up for this element, skip it.
//     if (ele.getAttribute(listeningAttr)) {
//       continue;
//     }
//     ele.addEventListener('mouseenter', () => {
//       ipcRenderer.invoke('set-ignore-mouse-events', false);
//     });
//     ele.addEventListener('mouseleave', () => {
//       ipcRenderer.invoke('set-ignore-mouse-events', true, { forward: true });
//     });
//     ele.setAttribute(listeningAttr, true);
//   }
// }

// This listener will allow us to leave the call from the context menu
// The main process will send a "leave-call" event when the user clicks
// that button in the menu, and the preload will then dispatch a matching
// event to the DOM.
ipcRenderer.on('leave-call', () => {
  window.dispatchEvent(new Event('leave-call'));
});

ipcRenderer.on('join-call', (e, arg) => {
  const event = new CustomEvent('join-call', {
    detail: {
      url: arg.url,
      name: arg.name,
    },
  });
  window.dispatchEvent(event);
});

// Expose the close function to the main world.
contextBridge.exposeInMainWorld('api', {
  close: () => {
    ipcRenderer.invoke('close-app');
  },
  callJoinUpdate: (joined) => {
    ipcRenderer.invoke('call-join-update', joined);
  },
  sendMouseMove: (x, y) => {
    ipcRenderer.invoke('send-input-event', { type: 'mouseMove', x: x, y: y });
  },
  sendMouseDown: (x, y) => {
    ipcRenderer.invoke('send-input-event', { type: 'mouseDown', x: x, y: y });
  },
  sendMouseUp: (x, y) => {
    ipcRenderer.invoke('send-input-event', { type: 'mouseUp', x: x, y: y });
  },
  sendMouseWheel: (deltaX, deltaY) => {
    ipcRenderer.invoke('send-input-event', { type: 'mouseWheel', deltaX: deltaX, deltaY: deltaY });
  },
  // sendKeyDown: (keyDown) => {
  //   ipcRenderer.invoke('send-input-event', { type: 'keyDown', keyDown: keyDown });
  // },
  leftCall: () => {
    ipcRenderer.invoke('left-call');
  },
  requestSync: () => {
    ipcRenderer.invoke('request-sync', null);
  },
  requestPresets: () => {
    ipcRenderer.invoke('request-presets', null);
  },
  requestEdit: () => {
    ipcRenderer.invoke('request-edit', null);
  },

});

// // This listener will allow us to handle a call join failure.
// ipcRenderer.on('join-failure', () => {
//   window.dispatchEvent(new Event('join-failure'));
// });

// ipcRenderer.on('left-call', () => {
//   window.dispatchEvent(new Event('left-call'));
// });

// // Expose the joinCall function to the main world.
// contextBridge.exposeInMainWorld('api', {
//   joinCall: (url, name) => {
//     ipcRenderer.invoke('join-call', url, name);
//   },
// });