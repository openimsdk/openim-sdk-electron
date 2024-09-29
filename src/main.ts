import { ipcMain, powerMonitor, WebContents } from 'electron';
import { CbEvents } from '@openim/wasm-client-sdk';
import OpenIMSDK from './core';

class OpenIMSDKMain {
  private sdk: OpenIMSDK;
  private webContents: WebContents[] = [];
  constructor(
    path: string,
    webContent?: WebContents,
    enterprise = false,
    basertc = false
  ) {
    this.sdk = new OpenIMSDK(path, this.emitProxy, enterprise, basertc);
    if (webContent) {
      this.webContents = [webContent];
    }
    this.systemStateHandler();
    this.initMethodsHandler();
  }

  private systemStateHandler = () => {
    powerMonitor.on('suspend', () => {
      this.sdk.setAppBackgroundStatus(true);
    });
    powerMonitor.on('resume', () => {
      this.sdk.setAppBackgroundStatus(false);
    });
  };

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
