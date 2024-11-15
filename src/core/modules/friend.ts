import { v4 as uuidV4 } from 'uuid';
import OpenIMSDK from '..';

import { BaseResponse } from '@/types/entity';
import {
  AccessFriendApplicationParams,
  AddBlackParams,
  AddFriendParams,
  GetSpecifiedFriendsParams,
  OffsetParams,
  PinFriendParams,
  RemarkFriendParams,
  SearchFriendParams,
  SetFriendExParams,
  UpdateFriendsParams,
} from '@openim/wasm-client-sdk/lib/types/params';
import {
  FriendshipInfo,
  BlackUserItem,
  FriendApplicationItem,
  SearchedFriendsInfo,
  FriendUserItem,
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
        openIMSDK.libOpenIMSDK.update_friends(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify({
            friendUserIDs: params.toUserIDs,
            ex: params.ex,
          })
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

    getFriendList: (filterBlack?: boolean, opid = uuidV4()) =>
      new Promise<BaseResponse<FriendUserItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_friend_list(
          openIMSDK.baseCallbackWrap<FriendUserItem[]>(resolve, reject),
          opid,
          filterBlack ? 1 : 0
        );
      }),
    getFriendListPage: (
      params: OffsetParams & { filterBlack?: boolean },
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<FriendUserItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_friend_list_page(
          openIMSDK.baseCallbackWrap<FriendUserItem[]>(resolve, reject),
          opid,
          params.offset,
          params.count,
          params.filterBlack ? 1 : 0
        );
      }),

    updateFriends: (params: UpdateFriendsParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.update_friends(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getSpecifiedFriendsInfo: (
      params: GetSpecifiedFriendsParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<FriendUserItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_specified_friends_info(
          openIMSDK.baseCallbackWrap<FriendUserItem[]>(resolve, reject),
          opid,
          JSON.stringify(params.friendUserIDList),
          params.filterBlack ? 1 : 0
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
        openIMSDK.libOpenIMSDK.update_friends(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify({
            friendUserIDs: [params.toUserID],
            remark: params.remark,
          })
        );
      }),

    pinFriends: (params: PinFriendParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.update_friends(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify({
            friendUserIDs: params.toUserIDs,
            isPinned: params.isPinned,
          })
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
  getFriendList: (
    filterBlack?: boolean,
    opid?: string
  ) => Promise<BaseResponse<FriendUserItem[]>>;
  getFriendListPage: (
    params: OffsetParams & { filterBlack?: boolean },
    opid?: string
  ) => Promise<BaseResponse<FriendUserItem[]>>;
  updateFriends: (
    params: UpdateFriendsParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  getSpecifiedFriendsInfo: (
    params: GetSpecifiedFriendsParams,
    opid?: string
  ) => Promise<BaseResponse<FriendUserItem[]>>;
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
