import { v4 as uuidV4 } from 'uuid';
import { BaseResponse } from '@/types/entity';
import OpenIMSDK from '..';
import { MessageReceiveOptType } from '@openim/wasm-client-sdk';
import {
  SelfUserInfo,
  UserOnlineState,
  PublicUserItem,
} from '@openim/wasm-client-sdk/lib/types/entity';
import { PartialUserItem } from '@openim/wasm-client-sdk/lib/types/params';

export function setupUserModule(openIMSDK: OpenIMSDK) {
  return {
    getSelfUserInfo: (opid = uuidV4()) =>
      new Promise<BaseResponse<SelfUserInfo>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_self_user_info(
          openIMSDK.baseCallbackWrap<SelfUserInfo>(resolve, reject),
          opid
        );
      }),

    setSelfInfo: (params: PartialUserItem, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.set_self_info(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getUsersInfo: (params: string[], opid = uuidV4()) =>
      new Promise<BaseResponse<PublicUserItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_users_info(
          openIMSDK.baseCallbackWrap<PublicUserItem[]>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    subscribeUsersStatus: (userIDList: string[], opid = uuidV4()) =>
      new Promise<BaseResponse<UserOnlineState>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.subscribe_users_status(
          openIMSDK.baseCallbackWrap<UserOnlineState>(resolve, reject),
          opid,
          JSON.stringify(userIDList)
        );
      }),

    unsubscribeUsersStatus: (userIDList: string[], opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.unsubscribe_users_status(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(userIDList)
        );
      }),

    getSubscribeUsersStatus: (opid = uuidV4()) =>
      new Promise<BaseResponse<UserOnlineState[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_subscribe_users_status(
          openIMSDK.baseCallbackWrap<UserOnlineState[]>(resolve, reject),
          opid
        );
      }),

    setGlobalRecvMessageOpt: (
      msgReceiveOptType: MessageReceiveOptType,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.set_self_info(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify({
            globalRecvMsgOpt: msgReceiveOptType,
          })
        );
      }),
  };
}

export interface UserModuleApi {
  getSelfUserInfo: (opid?: string) => Promise<BaseResponse<SelfUserInfo>>;
  setSelfInfo: (
    params: PartialUserItem,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  getUsersInfo: (
    params: string[],
    opid?: string
  ) => Promise<BaseResponse<PublicUserItem[]>>;
  subscribeUsersStatus: (
    userIDList: string[],
    opid?: string
  ) => Promise<BaseResponse<UserOnlineState>>;
  unsubscribeUsersStatus: (
    userIDList: string[],
    opid?: string
  ) => Promise<BaseResponse<void>>;
  getSubscribeUsersStatus: (
    opid?: string
  ) => Promise<BaseResponse<UserOnlineState[]>>;
  setGlobalRecvMessageOpt: (
    msgReceiveOptType: MessageReceiveOptType,
    opid?: string
  ) => Promise<BaseResponse<void>>;
}
