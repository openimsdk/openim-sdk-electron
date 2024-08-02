import { v4 as uuidV4 } from 'uuid';
import OpenIMSDK from '..';

import { BaseResponse } from '@/types/entity';
import {
  AccessFriendApplicationParams,
  AddBlackParams,
  AddFriendParams,
  OffsetParams,
  RemarkFriendParams,
  SearchFriendParams,
  SetFriendExParams,
} from '@openim/wasm-client-sdk/lib/types/params';
import {
  FriendshipInfo,
  BlackUserItem,
  FriendApplicationItem,
  FullUserItem,
  SearchedFriendsInfo,
} from '@openim/wasm-client-sdk/lib/types/entity';

export function setupFriendModule(openIMSDK: OpenIMSDK) {
  return {
    acceptFriendApplication: (
      params: AccessFriendApplicationParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.accept_friend_application(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    addBlack: (params: AddBlackParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.add_black(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.toUserID,
          params.ex ?? ''
        );
      }),

    addFriend: (params: AddFriendParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.add_friend(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    checkFriend: (userIDList: string[], opid = uuidV4()) =>
      new Promise<BaseResponse<FriendshipInfo[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.check_friend(
          openIMSDK.baseCallbackWrap<FriendshipInfo[]>(resolve, reject),
          opid,
          JSON.stringify(userIDList)
        );
      }),

    deleteFriend: (userID: string, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.delete_friend(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          userID
        );
      }),

    setFriendsEx: (params: SetFriendExParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.set_friends_ex(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params),
          params.ex ?? ''
        );
      }),

    getBlackList: (opid = uuidV4()) =>
      new Promise<BaseResponse<BlackUserItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_black_list(
          openIMSDK.baseCallbackWrap<BlackUserItem[]>(resolve, reject),
          opid
        );
      }),

    getFriendApplicationListAsApplicant: (opid = uuidV4()) =>
      new Promise<BaseResponse<FriendApplicationItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_friend_application_list_as_applicant(
          openIMSDK.baseCallbackWrap<FriendApplicationItem[]>(resolve, reject),
          opid
        );
      }),

    getFriendApplicationListAsRecipient: (opid = uuidV4()) =>
      new Promise<BaseResponse<FriendApplicationItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_friend_application_list_as_recipient(
          openIMSDK.baseCallbackWrap<FriendApplicationItem[]>(resolve, reject),
          opid
        );
      }),

    getFriendList: (opid = uuidV4()) =>
      new Promise<BaseResponse<FullUserItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_friend_list(
          openIMSDK.baseCallbackWrap<FullUserItem[]>(resolve, reject),
          opid
        );
      }),
    getFriendListPage: (params: OffsetParams, opid = uuidV4()) =>
      new Promise<BaseResponse<FullUserItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_friend_list_page(
          openIMSDK.baseCallbackWrap<FullUserItem[]>(resolve, reject),
          opid,
          params.offset,
          params.count
        );
      }),

    getSpecifiedFriendsInfo: (userIDList: string[], opid = uuidV4()) =>
      new Promise<BaseResponse<FullUserItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_specified_friends_info(
          openIMSDK.baseCallbackWrap<FullUserItem[]>(resolve, reject),
          opid,
          JSON.stringify(userIDList)
        );
      }),

    refuseFriendApplication: (
      params: AccessFriendApplicationParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.refuse_friend_application(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    removeBlack: (userID: string, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.remove_black(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          userID
        );
      }),

    searchFriends: (params: SearchFriendParams, opid = uuidV4()) =>
      new Promise<BaseResponse<SearchedFriendsInfo[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.search_friends(
          openIMSDK.baseCallbackWrap<SearchedFriendsInfo[]>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    setFriendRemark: (params: RemarkFriendParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.set_friend_remark(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),
  };
}

export interface FriendModuleApi {
  acceptFriendApplication: (
    params: AccessFriendApplicationParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  addBlack: (userID: string, opid?: string) => Promise<BaseResponse<void>>;
  addFriend: (userID: string, opid?: string) => Promise<BaseResponse<void>>;
  checkFriend: (
    userIDList: string[],
    opid?: string
  ) => Promise<BaseResponse<FriendshipInfo[]>>;
  deleteFriend: (userID: string, opid?: string) => Promise<BaseResponse<void>>;
  setFriendsEx: (
    params: SetFriendExParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  getBlackList: (opid?: string) => Promise<BaseResponse<BlackUserItem[]>>;
  getFriendApplicationListAsApplicant: (
    opid?: string
  ) => Promise<BaseResponse<FriendApplicationItem[]>>;
  getFriendApplicationListAsRecipient: (
    opid?: string
  ) => Promise<BaseResponse<FriendApplicationItem[]>>;
  getFriendList: (opid?: string) => Promise<BaseResponse<FullUserItem[]>>;
  getFriendListPage: (
    params: OffsetParams,
    opid?: string
  ) => Promise<BaseResponse<FullUserItem[]>>;
  getSpecifiedFriendsInfo: (
    userIDList: string[],
    opid?: string
  ) => Promise<BaseResponse<FullUserItem[]>>;
  refuseFriendApplication: (
    params: AccessFriendApplicationParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  removeBlack: (userID: string, opid?: string) => Promise<BaseResponse<void>>;
  searchFriends: (
    params: SearchFriendParams,
    opid?: string
  ) => Promise<BaseResponse<SearchedFriendsInfo[]>>;
  setFriendRemark: (
    params: RemarkFriendParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
}
