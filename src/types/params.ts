import { LogLevel } from '@openim/wasm-client-sdk';
export interface InitConfig {
  apiAddr: string;
  wsAddr: string;
  logLevel?: LogLevel;
  platformID: number;
  dataDir: string;
  logFilePath?: string;
  isLogStandardOutput?: boolean;
  isExternalExtensions?: boolean;
  systemType: string;
}

export interface LoginParams {
  userID: string;
  token: string;
}

export type SoundMsgByPathParams = {
  soundPath: string;
  duration: number;
};

export type VideoMsgByPathParams = {
  videoPath: string;
  videoType: string;
  duration: number;
  snapshotPath: string;
};

export type FileMsgByPathParams = {
  filePath: string;
  fileName: string;
};

export type UploadLogsParams = {
  line: number;
  ex?: string;
};

export type LogsParams = {
  logLevel: LogLevel;
  file: string;
  line: number;
  msgs: string;
  err: string;
  keyAndValue: string[];
};

export type DebugLogsParams = {
  msgs: string;
  keyAndValue: string[];
};

export type ErrorLogsParams = {
  msgs: string;
  err: string;
};
