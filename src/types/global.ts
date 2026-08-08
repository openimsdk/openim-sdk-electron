import { SdkEvent, SdkResponse } from '@openim/wasm-client-sdk';

export interface OpenIMRenderBridge {
  subscribe: (
    channel: string,
    callback: (event: SdkEvent, data: unknown) => void
  ) => () => void;
  invokeSdkMethod: (method: string, ...args: unknown[]) => Promise<SdkResponse>;
}

declare global {
  interface Window {
    openIMRenderBridge?: OpenIMRenderBridge;
  }
}
