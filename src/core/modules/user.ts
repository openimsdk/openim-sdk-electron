import { v4 as uuidV4 } from 'uuid';
import { BaseResponse } from '@/types/entity';
import OpenIMSDK from '..';
import { MessageReceiveOptType } from '@openim/wasm-client-sdk';
import {
  SelfUserInfo,
  FullUserItemWithCache,
  UserOnlineState,
} from '@openim/wasm-client-sdk/lib/types/entity';
import {
  GetUserInfoWithCacheParams,
  PartialUserItem,
} from '@openim/wasm-client-sdk/lib/types/params';

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

    getUsersInfoWithCache: (
      params: GetUserInfoWithCacheParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<FullUserItemWithCache[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_users_info_with_cache(
          openIMSDK.baseCallbackWrap<FullUserItemWithCache[]>(resolve, reject),
          opid,
          JSON.stringify(params.userIDList),
          params.groupID ?? ''
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
        openIMSDK.libOpenIMSDK.set_global_recv_message_opt(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          msgReceiveOptType
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
  getUsersInfoWithCache: (
    params: GetUserInfoWithCacheParams,
    opid?: string
  ) => Promise<BaseResponse<FullUserItemWithCache[]>>;
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
