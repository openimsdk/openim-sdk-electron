import type { LogLevel } from '@openim/wasm-client-sdk';

export interface InitConfig {
  apiAddr: string;
  wsAddr: string;
  platformID: number;
  dataDir: string;
  systemType: string;
  logLevel?: LogLevel;
  logFilePath?: string;
  isLogStandardOutput?: boolean;
  isExternalExtensions?: boolean;
}

export interface NativeLoginParams {
  userID: string;
  token: string;
}

export type UploadLogsParams = {
  line: number;
  ex?: string;
};

export type LogMessageParams = {
  msgs: string;
  keyAndValue: string[];
};

export type LogErrorParams = {
  msgs: string;
  err: string;
};

// Compatibility names retained for applications upgrading from patch.10.
/** @deprecated Use `NativeLoginParams` instead. */
export type LoginParams = NativeLoginParams;
/** @deprecated Use the Core-aligned sound message parameters instead. */
export type SoundMsgByPathParams = {
  soundPath: string;
  duration: number;
};
/** @deprecated Use the Core-aligned video message parameters instead. */
export type VideoMsgByPathParams = {
  videoPath: string;
  videoType: string;
  duration: number;
  snapshotPath: string;
};
/** @deprecated Use the Core-aligned file message parameters instead. */
export type FileMsgByPathParams = {
  filePath: string;
  fileName: string;
};
/** @deprecated Use the dedicated log parameter types instead. */
export type LogsParams = {
  logLevel: LogLevel;
  file: string;
  line: number;
  msgs: string;
  err: string;
  keyAndValue: string[];
};
/** @deprecated Use `LogMessageParams` instead. */
export type DebugLogsParams = LogMessageParams;
/** @deprecated Use `LogErrorParams` instead. */
export type ErrorLogsParams = LogErrorParams;
