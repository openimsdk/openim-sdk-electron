import { contextBridge, ipcRenderer } from 'electron';

const updateOnlineStatus = () =>
  ipcRenderer.invoke('openim-sdk-ipc-methods', 'networkStatusChanged');

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

contextBridge.exposeInMainWorld('openIMRenderApi', {
  subscribe: (channel: string, callback: (...args: any[]) => void) => {
    const subscription = (_: unknown, ...args: any[]) => callback(...args);
    ipcRenderer.on(channel, subscription);
    return () => ipcRenderer.removeListener(channel, subscription);
  },
  imMethodsInvoke: (method: string, ...args: any[]) =>
    ipcRenderer.invoke('openim-sdk-ipc-methods', method, ...args),
});
