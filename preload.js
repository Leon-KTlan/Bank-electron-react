const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  ipcRenderer: {
    on: (channel, func) => { // [!code ++]
      ipcRenderer.on(channel, (event, ...args) => func(...args)); // [!code ++]
    }, // [!code ++]
    removeListener: (channel, func) => { // [!code ++]
      ipcRenderer.removeListener(channel, func); // [!code ++]
    }, // [!code ++]
    send: (channel, data) => { // [!code ++]
      ipcRenderer.send(channel, data); // [!code ++]
    } // [!code ++]
  }
});