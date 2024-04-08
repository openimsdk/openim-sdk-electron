import { LogLevel } from 'open-im-sdk-wasm';
export interface InitConfig {
  apiAddr: string;
  wsAddr: string;
  logLevel?: LogLevel;
  platformID: number;
  dataDir: string;
  logFilePath?: string;
  isLogStandardOutput?: boolean;
  isExternalExtensions?: boolean;
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
