const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  scanFolder: () => ipcRenderer.invoke('scan:folder'),
  googleLogin: () => ipcRenderer.invoke('google:login') // <- LINHA NOVA
});