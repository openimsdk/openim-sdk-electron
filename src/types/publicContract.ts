import type { getSDK } from '@openim/wasm-client-sdk';
import type OpenIMSdk from '@/core';
import type { OPENIM_PUBLIC_SDK_METHODS } from '@/main';

type UnsupportedNativeMethod =
  | 'createImageMessageByFile'
  | 'createVideoMessageByFile'
  | 'createSoundMessageByFile'
  | 'createFileMessageByFile'
  | 'fileMapSet'
  | 'exportDB'
  | 'markMessagesAsReadByMsgID';
type NativeSupportedSdk = Omit<
  ReturnType<typeof getSDK>,
  'login' | 'emit' | 'on' | 'off' | UnsupportedNativeMethod
>;
type AssertAssignable<T extends NativeSupportedSdk> = T;
type AssertNever<T extends never> = T;
type IpcMethod = (typeof OPENIM_PUBLIC_SDK_METHODS)[number];
type MissingIpcMethod = Exclude<keyof NativeSupportedSdk, IpcMethod>;

export type NativePublicApiContract = AssertAssignable<OpenIMSdk>;
export type NativeIpcMethodContract = AssertNever<MissingIpcMethod>;
