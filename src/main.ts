import { ipcMain, WebContents } from 'electron';
import { CbEvents } from '@openim/wasm-client-sdk';
import OpenIMSDK from './core';

class OpenIMSDKMain {
  private sdk: OpenIMSDK;
  private webContents: WebContents[] = [];
  constructor(path: string, webContent?: WebContents, enterprise = false) {
    this.sdk = new OpenIMSDK(path, this.emitProxy, enterprise);
    if (webContent) {
      this.webContents = [webContent];
    }
    this.initMethodsHandler();
  }

  private initMethodsHandler = () => {
    ipcMain.handle('openim-sdk-ipc-methods', async (_, method, ...args) => {
      try {
        // @ts-ignore
        // eslint-disable-next-line
        return await this.sdk[method](...args);
      } catch (error) {
        return error;
      }
    });
  };

  private emitProxy = (event: CbEvents, data: any) => {
    this.webContents.forEach(webContent => {
      if (!webContent.isDestroyed()) {
        webContent.send('openim-sdk-ipc-event', event, data);
      }
    });
  };

  public addWebContent(webContent: WebContents) {
    this.webContents.push(webContent);
  }
}

export default OpenIMSDKMain;
