import { uuidV4 } from '@/utils/uuid';
import { SdkResponse } from '@/types/entity';
import OpenIMSdk from '..';
import {
  SetSelfInfoParams,
  SelfUserInfo,
  UserOnlineState,
  PublicUserItem,
} from '@openim/wasm-client-sdk';

export function setupUserModule(openIMSdk: OpenIMSdk) {
  return {
    getSelfUserInfo: (opid = uuidV4()) =>
      new Promise<SdkResponse<SelfUserInfo>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_self_user_info(
          openIMSdk.baseCallbackWrap<SelfUserInfo>(resolve, reject),
          opid
        );
      }),

    setSelfInfo: (params: SetSelfInfoParams, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.set_self_info(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getUsersInfo: (params: string[], opid = uuidV4()) =>
      new Promise<SdkResponse<PublicUserItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_users_info(
          openIMSdk.baseCallbackWrap<PublicUserItem[]>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    subscribeUsersStatus: (userIDList: string[], opid = uuidV4()) =>
      new Promise<SdkResponse<UserOnlineState[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.subscribe_users_status(
          openIMSdk.baseCallbackWrap<UserOnlineState[]>(resolve, reject),
          opid,
          JSON.stringify(userIDList)
        );
      }),

    unsubscribeUsersStatus: (userIDList: string[], opid = uuidV4()) =>
      new Promise<SdkResponse<UserOnlineState[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.unsubscribe_users_status(
          openIMSdk.baseCallbackWrap<UserOnlineState[]>(resolve, reject),
          opid,
          JSON.stringify(userIDList)
        );
      }),

    getSubscribeUsersStatus: (opid = uuidV4()) =>
      new Promise<SdkResponse<UserOnlineState[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_subscribe_users_status(
          openIMSdk.baseCallbackWrap<UserOnlineState[]>(resolve, reject),
          opid
        );
      }),

    getUserStatus: (userIDList: string[], opid = uuidV4()) =>
      new Promise<SdkResponse<UserOnlineState[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_user_status(
          openIMSdk.baseCallbackWrap<UserOnlineState[]>(resolve, reject),
          opid,
          JSON.stringify(userIDList)
        );
      }),
  };
}

export interface UserModuleApi {
  getSelfUserInfo: (opid?: string) => Promise<SdkResponse<SelfUserInfo>>;
  setSelfInfo: (
    params: SetSelfInfoParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  getUsersInfo: (
    params: string[],
    opid?: string
  ) => Promise<SdkResponse<PublicUserItem[]>>;
  subscribeUsersStatus: (
    userIDList: string[],
    opid?: string
  ) => Promise<SdkResponse<UserOnlineState[]>>;
  unsubscribeUsersStatus: (
    userIDList: string[],
    opid?: string
  ) => Promise<SdkResponse<UserOnlineState[]>>;
  getSubscribeUsersStatus: (
    opid?: string
  ) => Promise<SdkResponse<UserOnlineState[]>>;
  getUserStatus: (
    userIDList: string[],
    opid?: string
  ) => Promise<SdkResponse<UserOnlineState[]>>;
}
