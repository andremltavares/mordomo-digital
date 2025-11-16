const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  scanFolder: () => ipcRenderer.invoke('scan:folder'),
  googleLogin: () => ipcRenderer.invoke('google:login'),
  scanDrive: () => ipcRenderer.invoke('scan:drive') // <- LINHA NOVA
});