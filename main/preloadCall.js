const { contextBridge, ipcRenderer } = require('electron');

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  refreshClickableElements();
});

const observer = new MutationObserver((mutationList) => {
  mutationList
    .filter((m) => m.type === 'childList')
    .forEach((mutation) => {
      refreshClickableElements();
    });
});

// Start observing the target for added/removed nodes
observer.observe(window.document, { childList: true, subtree: true });

// window.addEventListener('DOMNodeInserted', () => {
//   refreshClickableElements();
// });

// refreshClickableElements finds all DOM elements which can be clicked
// and adds listeners to detect mouse enter and leave events. When the user
// is hovering over a clickable element, we will get Electron to stop
// ignoring mouse events by default. When a mouse leaves a clickable element,
// we'll set the app to ignore mouse clicks once more (to let the user
// interact with background applications)
function refreshClickableElements() {
  const clickableElements = document.querySelectorAll('.clickable');
  const tiles = document.querySelector("#tiles");
  const listeningAttr = 'listeningForMouse';
  for (let i = 0; i < clickableElements.length; i += 1) {
    const ele = clickableElements[i];
    // If the listeners are already set up for this element, skip it.

    if (ele.getAttribute(listeningAttr)) {
      continue;
    }
    ele.addEventListener('mouseenter', () => {
      if (tiles.classList.contains("clickthrough") && (ele.classList.contains('participant') || ele.classList.contains('tile') || ele.classList.contains('fit') || ele.classList.contains('resize-handle'))) {
        ipcRenderer.invoke('set-ignore-mouse-events', true, { forward: true })
        // console.log("ign");
      } else {
        ipcRenderer.invoke('set-ignore-mouse-events', false);
        // console.log(ele.classList);
      }
      // console.log(tiles.classList);
      // ipcRenderer.invoke('focus-call', true);
    });
    ele.addEventListener('mouseleave', () => {
      ipcRenderer.invoke('set-ignore-mouse-events', true, { forward: true });
    });
    ele.setAttribute(listeningAttr, true);
  }
}

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

ipcRenderer.on('join-failure', () => {
  window.dispatchEvent(new Event('join-failure'));
});

ipcRenderer.on('left-call', () => {
  window.dispatchEvent(new Event('left-call'));
});

// Expose the joinCall function to the main world.
contextBridge.exposeInMainWorld('api', {
  close: () => {
    ipcRenderer.invoke('close-app');
  },
  toggleSeeMyself: () => {
    ipcRenderer.invoke('toggle-self');
  },
  joinCall: (url, name) => {
    ipcRenderer.invoke('join-call', url, name);
  },
  refreshPage: () => {
    ipcRenderer.invoke('refresh-page', null);
  },
  pageHome: () => {
    ipcRenderer.invoke('page-home', null);
  },
  pageBack: () => {
    ipcRenderer.invoke('page-back', null);
  },
  pageForward: () => {
    ipcRenderer.invoke('page-forward', null);
  },
  pageGo: () => {
    ipcRenderer.invoke('page-go', null);
  },
  pageDev: () => {
    ipcRenderer.invoke('page-dev', null);
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