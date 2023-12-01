import { v4 as uuidV4 } from 'uuid';
import { BaseResponse, SelfUserInfo } from '@/types/entity';
import OpenIMSDK from '..';
import { SetSelfInfoParams } from '@/types/params';

export function setupUserModule(openIMSDK: OpenIMSDK) {
  return {
    getSelfUserInfo: (opid = uuidV4()) =>
      new Promise<BaseResponse<SelfUserInfo>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_self_user_info(
          openIMSDK.baseCallbackWrap<SelfUserInfo>(resolve, reject),
          opid
        );
      }),

    setSelfInfo: (params: SetSelfInfoParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.set_self_info(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    // getUsersInfoWithCache: (
    //   params: GetUserInfoWithCacheParams,
    //   opid = uuidV4()
    // ) =>
    //   new Promise<BaseResponse<FullUserItemWithCache[]>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.get_users_info_with_cache(
    //       openIMSDK.baseCallbackWrap<FullUserItemWithCache[]>(resolve, reject),
    //       opid,
    //       JSON.stringify(params.userIDList),
    //       params.groupID ?? ''
    //     );
    //   }),

    //   subscribeUsersStatus: (userIDList: string[], opid = uuidV4()) =>
    //   new Promise<BaseResponse<UserOnlineState>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.subscribe_users_status(
    //       openIMSDK.baseCallbackWrap<UserOnlineState>(resolve, reject),
    //       opid,
    //       JSON.stringify(userIDList)
    //     );
    //   }),

    // unsubscribeUsersStatus: (userIDList: string[], opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.unsubscribe_users_status(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       JSON.stringify(userIDList)
    //     );
    //   }),

    // getSubscribeUsersStatus: (opid = uuidV4()) =>
    //   new Promise<BaseResponse<UserOnlineState[]>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.get_subscribe_users_status(
    //       openIMSDK.baseCallbackWrap<UserOnlineState[]>(resolve, reject),
    //       opid
    //     );
    //   }),

    // setAppBackgroundStatus: (isInBackground: boolean, opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.set_app_background_status(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       isInBackground
    //     );
    //   }),

    // setGlobalRecvMessageOpt: (msgReceiveOptType: MessageReceiveOptType, opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.set_global_recv_message_opt(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       msgReceiveOptType
    //     );
    //   }),
  };
}

export interface UserModuleApi {
  getSelfUserInfo: (opid?: string) => Promise<BaseResponse<SelfUserInfo>>;
}
