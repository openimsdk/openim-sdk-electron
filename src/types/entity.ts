import { CbEvents } from '@openim/wasm-client-sdk';

export type EmitProxy = (event: CbEvents, ...args: any[]) => void;

export type BaseCallbackWrap = <T>(
  resolve: (response: BaseResponse<T>) => void,
  reject: (response: BaseResponse<T>) => void
) => Buffer;

export type AsyncRetunWrap = <T>(
  operationID: string,
  data: unknown
) => Promise<BaseResponse<T>>;

export interface BaseResponse<T = unknown> {
  errCode: number;
  errMsg: string;
  data: T;
  operationID: string;
}
