import { uuidV4 } from '@/utils/uuid';
import OpenIMSdk from '..';

import { SdkResponse } from '@/types/entity';
import {
  HandleFriendApplicationParams,
  AddBlackParams,
  AddFriendParams,
  GetFriendApplicationListAsApplicantParams,
  GetFriendApplicationListAsRecipientParams,
  ApplicationUnhandledCountParams,
  GetSpecifiedFriendsParams,
  PaginationParams,
  SearchFriendsParams,
  UpdateFriendsParams,
  CheckFriendResultItem,
  BlackUserItem,
  FriendApplicationItem,
  SearchFriendsResultItem,
  FriendUserItem,
} from '@openim/wasm-client-sdk';

export function setupFriendModule(openIMSdk: OpenIMSdk) {
  return {
    acceptFriendApplication: (
      params: HandleFriendApplicationParams,
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.accept_friend_application(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    addBlack: (params: AddBlackParams, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.add_black(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.toUserID,
          params.ex ?? ''
        );
      }),

    addFriend: (params: AddFriendParams, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.add_friend(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    checkFriend: (userIDList: string[], opid = uuidV4()) =>
      new Promise<SdkResponse<CheckFriendResultItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.check_friend(
          openIMSdk.baseCallbackWrap<CheckFriendResultItem[]>(resolve, reject),
          opid,
          JSON.stringify(userIDList)
        );
      }),

    deleteFriend: (userID: string, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.delete_friend(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          userID
        );
      }),

    getBlackList: (opid = uuidV4()) =>
      new Promise<SdkResponse<BlackUserItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_black_list(
          openIMSdk.baseCallbackWrap<BlackUserItem[]>(resolve, reject),
          opid
        );
      }),

    getFriendApplicationListAsApplicant: (
      params: GetFriendApplicationListAsApplicantParams = {
        offset: 0,
        count: 0,
      },
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<FriendApplicationItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_friend_application_list_as_applicant(
          openIMSdk.baseCallbackWrap<FriendApplicationItem[]>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getFriendApplicationListAsRecipient: (
      params: GetFriendApplicationListAsRecipientParams = {
        handleResults: [],
        offset: 0,
        count: 0,
      },
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<FriendApplicationItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_friend_application_list_as_recipient(
          openIMSdk.baseCallbackWrap<FriendApplicationItem[]>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),
    getFriendApplicationUnhandledCount: (
      params: ApplicationUnhandledCountParams,
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<number>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_friend_application_unhandled_count(
          openIMSdk.baseCallbackWrap<number>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getFriendList: (filterBlack?: boolean, opid = uuidV4()) =>
      new Promise<SdkResponse<FriendUserItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_friend_list(
          openIMSdk.baseCallbackWrap<FriendUserItem[]>(resolve, reject),
          opid,
          filterBlack ? 1 : 0
        );
      }),
    getFriendListPage: (
      params: PaginationParams & { filterBlack?: boolean },
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<FriendUserItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_friend_list_page(
          openIMSdk.baseCallbackWrap<FriendUserItem[]>(resolve, reject),
          opid,
          params.offset,
          params.count,
          params.filterBlack ? 1 : 0
        );
      }),

    updateFriends: (params: UpdateFriendsParams, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.update_friends(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getSpecifiedFriendsInfo: (
      params: GetSpecifiedFriendsParams,
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<FriendUserItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_specified_friends_info(
          openIMSdk.baseCallbackWrap<FriendUserItem[]>(resolve, reject),
          opid,
          JSON.stringify(params.friendUserIDList),
          params.filterBlack ? 1 : 0
        );
      }),

    refuseFriendApplication: (
      params: HandleFriendApplicationParams,
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.refuse_friend_application(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    removeBlack: (userID: string, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.remove_black(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          userID
        );
      }),

    searchFriends: (params: SearchFriendsParams, opid = uuidV4()) =>
      new Promise<SdkResponse<SearchFriendsResultItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.search_friends(
          openIMSdk.baseCallbackWrap<SearchFriendsResultItem[]>(
            resolve,
            reject
          ),
          opid,
          JSON.stringify(params)
        );
      }),
  };
}

export interface FriendModuleApi {
  acceptFriendApplication: (
    params: HandleFriendApplicationParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  addBlack: (
    params: AddBlackParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  addFriend: (
    params: AddFriendParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  checkFriend: (
    userIDList: string[],
    opid?: string
  ) => Promise<SdkResponse<CheckFriendResultItem[]>>;
  deleteFriend: (userID: string, opid?: string) => Promise<SdkResponse<void>>;
  getBlackList: (opid?: string) => Promise<SdkResponse<BlackUserItem[]>>;
  getFriendApplicationListAsApplicant: (
    params?: GetFriendApplicationListAsApplicantParams,
    opid?: string
  ) => Promise<SdkResponse<FriendApplicationItem[]>>;
  getFriendApplicationListAsRecipient: (
    params?: GetFriendApplicationListAsRecipientParams,
    opid?: string
  ) => Promise<SdkResponse<FriendApplicationItem[]>>;
  getFriendApplicationUnhandledCount: (
    params: ApplicationUnhandledCountParams,
    opid?: string
  ) => Promise<SdkResponse<number>>;
  getFriendList: (
    filterBlack?: boolean,
    opid?: string
  ) => Promise<SdkResponse<FriendUserItem[]>>;
  getFriendListPage: (
    params: PaginationParams & { filterBlack?: boolean },
    opid?: string
  ) => Promise<SdkResponse<FriendUserItem[]>>;
  updateFriends: (
    params: UpdateFriendsParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  getSpecifiedFriendsInfo: (
    params: GetSpecifiedFriendsParams,
    opid?: string
  ) => Promise<SdkResponse<FriendUserItem[]>>;
  refuseFriendApplication: (
    params: HandleFriendApplicationParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  removeBlack: (userID: string, opid?: string) => Promise<SdkResponse<void>>;
  searchFriends: (
    params: SearchFriendsParams,
    opid?: string
  ) => Promise<SdkResponse<SearchFriendsResultItem[]>>;
}
