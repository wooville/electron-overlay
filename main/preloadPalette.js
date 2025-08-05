const { contextBridge, ipcRenderer } = require('electron');

// This listener will allow us to handle a call join failure.
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
  }
});
