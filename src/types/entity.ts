import type {
  SdkEvent,
  SdkResponse as ClientSdkResponse,
} from '@openim/wasm-client-sdk';

export type SdkEventEmitter = (event: SdkEvent, data: unknown) => void;

export type SdkResponse<T = unknown> = ClientSdkResponse<T>;

// Compatibility names retained for applications upgrading from patch.10.
/** @deprecated Use `SdkEventEmitter` instead. */
export type EmitProxy = (event: SdkEvent, ...args: any[]) => void;
/** @deprecated Use `SdkResponse` instead. */
export interface BaseResponse<T = unknown> {
  errCode: number;
  errMsg: string;
  data: T;
  operationID: string;
}
/** @deprecated Use the Core-aligned callback response types instead. */
export type BaseCallbackWrap = <T>(
  resolve: (response: BaseResponse<T>) => void,
  reject: (response: BaseResponse<T>) => void
) => Buffer;
/** @deprecated Use the Core-aligned asynchronous response types instead. */
export type AsyncRetunWrap = <T>(
  operationID: string,
  data: unknown
) => Promise<BaseResponse<T>>;
