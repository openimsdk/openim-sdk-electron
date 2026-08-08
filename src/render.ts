import {
  getSDK as getWasmSdk,
  LoginParams,
  SdkEvent,
  SdkResponse,
  WasmPathConfig,
} from '@openim/wasm-client-sdk';
import Emitter from './utils/emitter';
import {
  InitConfig,
  UploadLogsParams,
  LogErrorParams,
  LogMessageParams,
} from './types/params';
export {
  type InitConfig,
  type LogErrorParams,
  type LogMessageParams,
  type UploadLogsParams,
};
export type { OpenIMRenderBridge } from './types/global';
import './types/global';

type SdkEventMap = {
  [key in SdkEvent]: unknown;
};

export type SdkEventLogSource = 'clib-render' | 'wasm-render';

export type SdkEventLogEntry = {
  event: SdkEvent;
  source: SdkEventLogSource;
  payload: unknown;
};

export type SdkEventLogHandler = (entry: SdkEventLogEntry) => void;

export type ElectronLoginParams = Pick<LoginParams, 'userID' | 'token'> &
  Partial<Omit<LoginParams, 'userID' | 'token'>>;

type WasmSdk = ReturnType<typeof getWasmSdk>;

const ELECTRON_NATIVE_UNSUPPORTED_METHOD_NAMES = [
  'createImageMessageByFile',
  'createVideoMessageByFile',
  'createSoundMessageByFile',
  'createFileMessageByFile',
  'fileMapSet',
  'exportDB',
  'markMessagesAsReadByMsgID',
] as const;
type ElectronNativeUnsupportedMethodName =
  (typeof ELECTRON_NATIVE_UNSUPPORTED_METHOD_NAMES)[number];
const ELECTRON_NATIVE_UNSUPPORTED_METHODS = new Set<string>(
  ELECTRON_NATIVE_UNSUPPORTED_METHOD_NAMES
);

export type OpenIMClientSdk = Omit<
  WasmSdk,
  'login' | ElectronNativeUnsupportedMethodName
> & {
  login: (
    params: ElectronLoginParams,
    operationID?: string
  ) => Promise<SdkResponse>;
  /**
   * @access only for electron
   */
  initSDK: (param: InitConfig, opid?: string) => Promise<boolean>;
  /**
   * @access only for electron
   */
  unInitSDK: (opid?: string) => Promise<SdkResponse<void>>;
  /**
   * @access only for electron
   */
  uploadLogs: (
    params: UploadLogsParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  /**
   * @access only for electron
   */
  verboseLogs: (
    params: LogMessageParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  debugLogs: (
    params: LogMessageParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  infoLogs: (
    params: LogMessageParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  warnLogs: (
    params: LogErrorParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  errorLogs: (
    params: LogErrorParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  fatalLogs: (
    params: LogErrorParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  panicLogs: (
    params: LogErrorParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
};

/** @deprecated Use `OpenIMClientSdk` instead. */
export type IMSDKInterface = OpenIMClientSdk;

type ElectronInvoke = (method: string, ...args: any[]) => Promise<SdkResponse>;

type CreateElectronOptions = {
  wasmConfig?: WasmPathConfig;
  invoke?: ElectronInvoke;
  onSdkEventLog?: SdkEventLogHandler;
};

let wasmSdk: OpenIMClientSdk | undefined;
let instance: OpenIMClientSdk | undefined;
const sdkEmitter = new Emitter();
let sdkEventLogHandler: SdkEventLogHandler | undefined;

// eslint-disable-next-line
const methodCache = new WeakMap<Function, any>();

const SDK_EVENT_VALUES = new Set<string>(
  Object.values(SdkEvent) as unknown as string[]
);

type EventPayloadEmitter = {
  emit: (event: SdkEvent, data: unknown) => unknown;
};

const notifySdkEventLog = (
  event: SdkEvent,
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

const wrapWasmEventEmitter = (sdk: OpenIMClientSdk) => {
  const emitter = sdk as unknown as EventPayloadEmitter & {
    __sdkEventLogWrapped__?: boolean;
  };

  if (emitter.__sdkEventLogWrapped__ || typeof emitter.emit !== 'function') {
    return;
  }

  const rawEmit = emitter.emit.bind(emitter);
  emitter.emit = ((event: SdkEvent, data: unknown) => {
    if (SDK_EVENT_VALUES.has(String(event))) {
      notifySdkEventLog(event, data, 'wasm-render');
    }

    return rawEmit(event, data);
  }) as EventPayloadEmitter['emit'];
  emitter.__sdkEventLogWrapped__ = true;
};

async function createWasmSdk(wasmConfig?: WasmPathConfig): Promise<void> {
  if (!wasmSdk) {
    const { getSDK } = await import('@openim/wasm-client-sdk');
    wasmSdk = getSDK(wasmConfig) as unknown as OpenIMClientSdk;
    wrapWasmEventEmitter(wasmSdk);
  }
}

export function getWithRenderProcess(options: CreateElectronOptions = {}) {
  const { wasmConfig, invoke } = options;
  if (Object.prototype.hasOwnProperty.call(options, 'onSdkEventLog')) {
    sdkEventLogHandler = options.onSdkEventLog;
  }

  const internalInvoke = invoke ?? window.openIMRenderBridge?.invokeSdkMethod;
  const subscribeCallback = (event: keyof SdkEventMap, data: unknown) => {
    notifySdkEventLog(event, data, 'clib-render');
    return sdkEmitter.emit(event, data);
  };

  if (instance) {
    return {
      instance,
      subscribeCallback,
    };
  }

  if (!internalInvoke && !wasmSdk) {
    createWasmSdk(wasmConfig);
  }

  window.openIMRenderBridge?.subscribe(
    'openim-sdk-ipc-event',
    subscribeCallback
  );

  const sdkProxyHandler: ProxyHandler<OpenIMClientSdk> = {
    get(_, prop) {
      if (
        typeof prop !== 'string' ||
        ELECTRON_NATIVE_UNSUPPORTED_METHODS.has(prop)
      ) {
        return undefined;
      }
      const methodName = prop as keyof OpenIMClientSdk;
      return async (...args: any[]) => {
        try {
          if (!internalInvoke) {
            if (!wasmSdk) {
              await createWasmSdk(wasmConfig);
            }
            const wasmMethod = wasmSdk![methodName] as unknown as (
              ...methodArgs: any[]
            ) => unknown;
            const cachedMethod = methodCache.get(wasmMethod);
            if (cachedMethod) {
              // eslint-disable-next-line
              return cachedMethod(...args);
            }
            // eslint-disable-next-line
            const method = async (...args: any[]) =>
              wasmMethod.apply(wasmSdk, args);
            methodCache.set(wasmMethod, method);
            return method(...args);
          }

          if (methodName === 'on' || methodName === 'off') {
            // @ts-ignore
            return sdkEmitter[methodName](...args);
          }

          const result = await internalInvoke(methodName, ...args);
          if (result?.errCode !== 0 && methodName !== 'initSDK') {
            throw result;
          }
          return result;
        } catch (error) {
          console.error(`Error invoking ${methodName}:`, error);
          throw error;
        }
      };
    },
  };

  instance = new Proxy({} as OpenIMClientSdk, sdkProxyHandler);

  return { instance, subscribeCallback };
}
