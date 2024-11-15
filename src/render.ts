import { CbEvents, getSDK as WasmGetSDK } from '@openim/wasm-client-sdk';
import {
  MessageItem,
  WsResponse,
} from '@openim/wasm-client-sdk/lib/types/entity';
import {
  WasmPathConfig,
  InitAndLoginConfig,
} from '@openim/wasm-client-sdk/lib/types/params';
import Emitter from './utils/emitter';
import {
  InitConfig,
  FileMsgByPathParams,
  SoundMsgByPathParams,
  VideoMsgByPathParams,
  UploadLogsParams,
  DebugLogsParams,
  ErrorLogsParams,
} from './types/params';

type EmitterEvents = {
  [key in CbEvents]: any;
};

type WasmInterface = ReturnType<typeof WasmGetSDK>;

export type IMSDKInterface = Omit<WasmInterface, 'login'> & {
  login: (
    params: Partial<InitAndLoginConfig>,
    operationID?: string
  ) => Promise<WsResponse>;
  /**
   * @access only for electron
   */
  initSDK: (param: InitConfig, opid?: string) => Promise<boolean>;
  /**
   * @access only for electron
   */
  unInitSDK: (opid?: string) => Promise<void>;
  /**
   * @access only for electron
   */
  createImageMessage: (
    imagePath: string,
    opid?: string
  ) => Promise<WsResponse<MessageItem>>;
  /**
   * @access only for electron
   */
  createImageMessageFromFullPath: (
    imagePath: string,
    opid?: string
  ) => Promise<WsResponse<MessageItem>>;
  /**
   * @access only for electron
   */
  createVideoMessage: (
    params: VideoMsgByPathParams,
    opid?: string
  ) => Promise<WsResponse<MessageItem>>;
  /**
   * @access only for electron
   */
  createVideoMessageFromFullPath: (
    params: VideoMsgByPathParams,
    opid?: string
  ) => Promise<WsResponse<MessageItem>>;
  /**
   * @access only for electron
   */
  createSoundMessage: (
    params: SoundMsgByPathParams,
    opid?: string
  ) => Promise<WsResponse<MessageItem>>;
  /**
   * @access only for electron
   */
  createSoundMessageFromFullPath: (
    params: SoundMsgByPathParams,
    opid?: string
  ) => Promise<WsResponse<MessageItem>>;
  /**
   * @access only for electron
   */
  createFileMessage: (
    params: FileMsgByPathParams,
    opid?: string
  ) => Promise<WsResponse<MessageItem>>;
  /**
   * @access only for electron
   */
  createFileMessageFromFullPath: (
    params: FileMsgByPathParams,
    opid?: string
  ) => Promise<WsResponse<MessageItem>>;
  /**
   * @access only for electron
   */
  uploadLogs: (
    params: UploadLogsParams,
    opid?: string
  ) => Promise<WsResponse<unknown>>;
  /**
   * @access only for electron
   */
  verboseLogs: (
    params: DebugLogsParams,
    opid?: string
  ) => Promise<WsResponse<unknown>>;
  debugLogs: (
    params: DebugLogsParams,
    opid?: string
  ) => Promise<WsResponse<unknown>>;
  infoLogs: (
    params: DebugLogsParams,
    opid?: string
  ) => Promise<WsResponse<unknown>>;
  warnLogs: (
    params: ErrorLogsParams,
    opid?: string
  ) => Promise<WsResponse<unknown>>;
  errorLogs: (
    params: ErrorLogsParams,
    opid?: string
  ) => Promise<WsResponse<unknown>>;
  fatalLogs: (
    params: ErrorLogsParams,
    opid?: string
  ) => Promise<WsResponse<unknown>>;
  panicLogs: (
    params: ErrorLogsParams,
    opid?: string
  ) => Promise<WsResponse<unknown>>;
};

type ElectronInvoke = (method: string, ...args: any[]) => Promise<WsResponse>;

type CreateElectronOptions = {
  wasmConfig?: WasmPathConfig;
  invoke?: ElectronInvoke;
};

let wasmSDK: IMSDKInterface | undefined;
let instance: IMSDKInterface | undefined;
const sdkEmitter = new Emitter();

// eslint-disable-next-line
const methodCache = new WeakMap<Function, any>();

async function createWasmSDK(wasmConfig?: WasmPathConfig): Promise<void> {
  if (!wasmSDK) {
    const { getSDK } = await import('@openim/wasm-client-sdk');
    wasmSDK = getSDK(wasmConfig) as unknown as IMSDKInterface;
  }
}

export function getWithRenderProcess(
  { wasmConfig, invoke } = {} as CreateElectronOptions
) {
  const interalInvoke = invoke ?? window.openIMRenderApi?.imMethodsInvoke;
  const subscribeCallback = (event: keyof EmitterEvents, data: any) =>
    sdkEmitter.emit(event, data);

  if (instance) {
    return {
      instance,
      subscribeCallback,
    };
  }

  if (!interalInvoke && !wasmSDK) {
    createWasmSDK(wasmConfig);
  }

  window.openIMRenderApi?.subscribe('openim-sdk-ipc-event', subscribeCallback);

  const sdkProxyHandler: ProxyHandler<IMSDKInterface> = {
    get(_, prop: keyof IMSDKInterface) {
      return async (...args: any[]) => {
        try {
          if (!interalInvoke) {
            if (!wasmSDK) {
              await createWasmSDK(wasmConfig);
            }
            const cachedMethod = methodCache.get(wasmSDK![prop]);
            if (cachedMethod) {
              // eslint-disable-next-line
              return cachedMethod(...args);
            }
            // @ts-ignore
            // eslint-disable-next-line
            const method = async (...args: any[]) => wasmSDK![prop](...args);
            methodCache.set(wasmSDK![prop], method);
            return method(...args);
          }

          if (prop === 'on' || prop === 'off') {
            // @ts-ignore
            return sdkEmitter[prop](...args);
          }

          const result = await interalInvoke(prop, ...args);
          if (result?.errCode !== 0 && prop !== 'initSDK') {
            throw result;
          }
          return result;
        } catch (error) {
          console.error(`Error invoking ${prop}:`, error);
          throw error;
        }
      };
    },
  };

  instance = new Proxy({} as IMSDKInterface, sdkProxyHandler);

  return { instance, subscribeCallback };
}
