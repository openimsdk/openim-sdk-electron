import { WsResponse } from '@openim/wasm-client-sdk/lib/types/entity';

export interface IOpenIMRenderAPI {
  subscribe: (
    channel: string,
    callback: (...args: any[]) => void
  ) => () => void;
  imMethodsInvoke: (method: string, ...args: any[]) => Promise<WsResponse>;
}

declare global {
  interface Window {
    openIMRenderApi?: IOpenIMRenderAPI;
  }
}
