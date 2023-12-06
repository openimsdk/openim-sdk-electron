import { v4 as uuidV4 } from 'uuid';
import OpenIMSDK from '..';
import {
  AccessFriendParams,
  SearchFriendParams,
  RemarkFriendParams,
  AddFriendParams,
} from '@/types/params';

import {
  BaseResponse,
  BlackUserItem,
  FriendApplicationItem,
  FriendshipInfo,
  FullUserItem,
  SearchedFriendsInfo,
} from '@/types/entity';

export function setupFriendModule(openIMSDK: OpenIMSDK) {
  return {
    acceptFriendApplication: (params: AccessFriendParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.accept_friend_application(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    addBlack: (userID: string, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.add_black(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          userID
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

    getSpecifiedFriendsInfo: (userIDList: string[], opid = uuidV4()) =>
      new Promise<BaseResponse<FullUserItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_specified_friends_info(
          openIMSDK.baseCallbackWrap<FullUserItem[]>(resolve, reject),
          opid,
          JSON.stringify(userIDList)
        );
      }),

    refuseFriendApplication: (params: AccessFriendParams, opid = uuidV4()) =>
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
    params: AccessFriendParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  addBlack: (userID: string, opid?: string) => Promise<BaseResponse<void>>;
  addFriend: (userID: string, opid?: string) => Promise<BaseResponse<void>>;
  checkFriend: (
    userIDList: string[],
    opid?: string
  ) => Promise<BaseResponse<FriendshipInfo[]>>;
  deleteFriend: (userID: string, opid?: string) => Promise<BaseResponse<void>>;
  getBlackList: (opid?: string) => Promise<BaseResponse<BlackUserItem[]>>;
  getFriendApplicationListAsApplicant: (
    opid?: string
  ) => Promise<BaseResponse<FriendApplicationItem[]>>;
  getFriendApplicationListAsRecipient: (
    opid?: string
  ) => Promise<BaseResponse<FriendApplicationItem[]>>;
  getFriendList: (opid?: string) => Promise<BaseResponse<FullUserItem[]>>;
  getSpecifiedFriendsInfo: (
    userIDList: string[],
    opid?: string
  ) => Promise<BaseResponse<FullUserItem[]>>;
  refuseFriendApplication: (
    params: AccessFriendParams,
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
