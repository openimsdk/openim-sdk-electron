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

export type SdkEventLogSource = 'clib-render' | 'wasm-render';

export type SdkEventLogEntry = {
  event: CbEvents;
  source: SdkEventLogSource;
  payload: unknown;
};

export type SdkEventLogHandler = (entry: SdkEventLogEntry) => void;

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
  getGroupApplicationBadgeCount: (opid?: string) => Promise<WsResponse<number>>;
  clearGroupApplicationBadgeCount: (opid?: string) => Promise<WsResponse<void>>;
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
  onSdkEventLog?: SdkEventLogHandler;
};

let wasmSDK: IMSDKInterface | undefined;
let instance: IMSDKInterface | undefined;
const sdkEmitter = new Emitter();
let sdkEventLogHandler: SdkEventLogHandler | undefined;

// eslint-disable-next-line
const methodCache = new WeakMap<Function, any>();

const CB_EVENT_VALUES = new Set<string>(
  Object.values(CbEvents) as unknown as string[]
);

type EventPayloadEmitter = {
  emit: (event: CbEvents, data: unknown) => unknown;
};

const notifySdkEventLog = (
  event: CbEvents,
  data: unknown,
  source: SdkEventLogSource
) => {
  if (!sdkEventLogHandler) {
    return;
  }

  try {
    sdkEventLogHandler({
      event,
      source,
      payload: data,
    });
  } catch (error) {
    console.error('Error invoking onSdkEventLog:', error);
  }
};

const wrapWasmEventEmitter = (sdk: IMSDKInterface) => {
  const emitter = sdk as unknown as EventPayloadEmitter & {
    __sdkEventLogWrapped__?: boolean;
  };

  if (emitter.__sdkEventLogWrapped__ || typeof emitter.emit !== 'function') {
    return;
  }

  const rawEmit = emitter.emit.bind(emitter);
  emitter.emit = ((event: CbEvents, data: unknown) => {
    if (CB_EVENT_VALUES.has(String(event))) {
      notifySdkEventLog(event, data, 'wasm-render');
    }

    return rawEmit(event, data);
  }) as EventPayloadEmitter['emit'];
  emitter.__sdkEventLogWrapped__ = true;
};

async function createWasmSDK(wasmConfig?: WasmPathConfig): Promise<void> {
  if (!wasmSDK) {
    const { getSDK } = await import('@openim/wasm-client-sdk');
    wasmSDK = getSDK(wasmConfig) as unknown as IMSDKInterface;
    wrapWasmEventEmitter(wasmSDK);
  }
}

export function getWithRenderProcess(options: CreateElectronOptions = {}) {
  const { wasmConfig, invoke } = options;
  if (Object.prototype.hasOwnProperty.call(options, 'onSdkEventLog')) {
    sdkEventLogHandler = options.onSdkEventLog;
  }

  const interalInvoke = invoke ?? window.openIMRenderApi?.imMethodsInvoke;
  const subscribeCallback = (event: keyof EmitterEvents, data: any) => {
    notifySdkEventLog(event, data, 'clib-render');
    return sdkEmitter.emit(event, data);
  };

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
