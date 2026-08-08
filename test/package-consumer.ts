import OpenIMSdkMain from '../lib/index';
import { getWithRenderProcess } from '../lib/render';
import type {
  ElectronLoginParams,
  InitConfig,
  IMSDKInterface,
  LogErrorParams,
  LogMessageParams,
  OpenIMClientSdk,
  OpenIMRenderBridge,
  UploadLogsParams,
} from '../lib/render';
import type {
  AsyncRetunWrap,
  BaseCallbackWrap,
  BaseResponse,
  EmitProxy,
} from '../lib/types/entity';
import type {
  DebugLogsParams,
  ErrorLogsParams,
  FileMsgByPathParams,
  LoginParams,
  LogsParams,
  SoundMsgByPathParams,
  VideoMsgByPathParams,
} from '../lib/types/params';

const sdk = undefined as unknown as OpenIMClientSdk;
const legacySdk = undefined as unknown as IMSDKInterface;
const bridge = undefined as unknown as OpenIMRenderBridge;

void OpenIMSdkMain;
void getWithRenderProcess;
void sdk;
void legacySdk;
void bridge;

type ElectronRenderParamTypes = [
  ElectronLoginParams,
  InitConfig,
  UploadLogsParams,
  LogMessageParams,
  LogErrorParams
];
void (undefined as unknown as ElectronRenderParamTypes);

type Patch10ElectronTypes = [
  AsyncRetunWrap,
  BaseCallbackWrap,
  BaseResponse,
  DebugLogsParams,
  EmitProxy,
  ErrorLogsParams,
  FileMsgByPathParams,
  LoginParams,
  LogsParams,
  SoundMsgByPathParams,
  VideoMsgByPathParams
];
void (undefined as unknown as Patch10ElectronTypes);

const patch10Response: BaseResponse<string> = {
  errCode: 0,
  errMsg: '',
  data: '',
  operationID: 'operation',
};
void patch10Response;

type UnsupportedMethod =
  | 'createImageMessageByFile'
  | 'createVideoMessageByFile'
  | 'createSoundMessageByFile'
  | 'createFileMessageByFile'
  | 'fileMapSet'
  | 'exportDB'
  | 'markMessagesAsReadByMsgID'
  | 'getLoginUserID'
  | 'getConversationIDBySessionType';
type AssertNever<T extends never> = T;
type NativeFacadeIsSafe = AssertNever<
  Extract<UnsupportedMethod, keyof OpenIMClientSdk>
>;
void (undefined as unknown as NativeFacadeIsSafe);
