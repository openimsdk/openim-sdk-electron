import { contextBridge, ipcRenderer } from 'electron';
import type { SdkEvent } from '@openim/wasm-client-sdk';
import {
  OPENIM_SDK_EVENT_CHANNEL,
  OPENIM_SDK_METHOD_CHANNEL,
} from './constant/ipc';

const updateOnlineStatus = () =>
  ipcRenderer.invoke(OPENIM_SDK_METHOD_CHANNEL, 'networkStatusChanged');

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

contextBridge.exposeInMainWorld('openIMRenderBridge', {
  subscribe: (
    channel: string,
    callback: (event: SdkEvent, data: unknown) => void
  ) => {
    if (channel !== OPENIM_SDK_EVENT_CHANNEL) {
      throw new Error(`Unsupported OpenIM IPC event channel: ${channel}`);
    }
    const subscription = (_: unknown, event: SdkEvent, data: unknown) =>
      callback(event, data);
    ipcRenderer.on(channel, subscription);
    return () => ipcRenderer.removeListener(channel, subscription);
  },
  invokeSdkMethod: (method: string, ...args: unknown[]) =>
    ipcRenderer.invoke(OPENIM_SDK_METHOD_CHANNEL, method, ...args),
});
