import { uuidV4 } from '@/utils/uuid';
import { SdkResponse } from '@/types/entity';
import OpenIMSdk from '..';
import {
  GroupItem,
  GroupApplicationItem,
  GroupMemberItem,
  CreateGroupParams,
  JoinGroupParams,
  SearchGroupsParams,
  HandleGroupApplicationParams,
  GetGroupMemberListParams,
  SearchGroupMembersParams,
  SetGroupMemberInfoParams,
  GetGroupMemberListByJoinTimeFilterParams,
  ChangeGroupMemberMuteParams,
  ChangeGroupMuteParams,
  TransferGroupOwnerParams,
  GroupMemberOperationParams,
  GroupMemberUserListParams,
  PaginationParams,
  ApplicationUnhandledCountParams,
  GroupApplicationListParams,
} from '@openim/wasm-client-sdk';

export function setupGroupModule(openIMSdk: OpenIMSdk) {
  return {
    createGroup: (params: CreateGroupParams, opid = uuidV4()) =>
      new Promise<SdkResponse<GroupItem>>((resolve, reject) => {
        openIMSdk.nativeSdk.create_group(
          openIMSdk.baseCallbackWrap<GroupItem>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    joinGroup: (params: JoinGroupParams, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.join_group(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.groupID,
          params.reqMsg,
          params.joinSource,
          params.ex ?? ''
        );
      }),

    inviteUserToGroup: (params: GroupMemberOperationParams, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.invite_user_to_group(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.groupID,
          params.reason,
          JSON.stringify(params.userIDList)
        );
      }),

    getJoinedGroupList: (opid = uuidV4()) =>
      new Promise<SdkResponse<GroupItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_joined_group_list(
          openIMSdk.baseCallbackWrap<GroupItem[]>(resolve, reject),
          opid
        );
      }),

    getJoinedGroupListPage: (params: PaginationParams, opid = uuidV4()) =>
      new Promise<SdkResponse<GroupItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_joined_group_list_page(
          openIMSdk.baseCallbackWrap<GroupItem[]>(resolve, reject),
          opid,
          params.offset,
          params.count
        );
      }),

    searchGroups: (params: SearchGroupsParams, opid = uuidV4()) =>
      new Promise<SdkResponse<GroupItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.search_groups(
          openIMSdk.baseCallbackWrap<GroupItem[]>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getSpecifiedGroupsInfo: (groupIDList: string[], opid = uuidV4()) =>
      new Promise<SdkResponse<GroupItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_specified_groups_info(
          openIMSdk.baseCallbackWrap<GroupItem[]>(resolve, reject),
          opid,
          JSON.stringify(groupIDList)
        );
      }),

    setGroupInfo: (
      params: Partial<GroupItem> & { groupID: string },
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.set_group_info(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getGroupApplicationListAsRecipient: (
      params: GroupApplicationListParams = {
        groupIDs: [],
        handleResults: [],
        offset: 0,
        count: 0,
      },
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<GroupApplicationItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_group_application_list_as_recipient(
          openIMSdk.baseCallbackWrap<GroupApplicationItem[]>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getGroupApplicationListAsApplicant: (
      params: GroupApplicationListParams = {
        groupIDs: [],
        handleResults: [],
        offset: 0,
        count: 0,
      },
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<GroupApplicationItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_group_application_list_as_applicant(
          openIMSdk.baseCallbackWrap<GroupApplicationItem[]>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getGroupApplicationUnhandledCount: (
      params: ApplicationUnhandledCountParams,
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<number>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_group_application_unhandled_count(
          openIMSdk.baseCallbackWrap<number>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    acceptGroupApplication: (
      params: HandleGroupApplicationParams,
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.accept_group_application(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.groupID,
          params.fromUserID,
          params.handleMsg
        );
      }),

    refuseGroupApplication: (
      params: HandleGroupApplicationParams,
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.refuse_group_application(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.groupID,
          params.fromUserID,
          params.handleMsg
        );
      }),

    getGroupMemberList: (params: GetGroupMemberListParams, opid = uuidV4()) =>
      new Promise<SdkResponse<GroupMemberItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_group_member_list(
          openIMSdk.baseCallbackWrap<GroupMemberItem[]>(resolve, reject),
          opid,
          params.groupID,
          params.filter,
          params.offset,
          params.count
        );
      }),

    getSpecifiedGroupMembersInfo: (
      params: GroupMemberUserListParams,
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<GroupMemberItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_specified_group_members_info(
          openIMSdk.baseCallbackWrap<GroupMemberItem[]>(resolve, reject),
          opid,
          params.groupID,
          JSON.stringify(params.userIDList)
        );
      }),

    searchGroupMembers: (params: SearchGroupMembersParams, opid = uuidV4()) =>
      new Promise<SdkResponse<GroupMemberItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.search_group_members(
          openIMSdk.baseCallbackWrap<GroupMemberItem[]>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    setGroupMemberInfo: (params: SetGroupMemberInfoParams, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.set_group_member_info(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getGroupMemberOwnerAndAdmin: (groupID: string, opid = uuidV4()) =>
      new Promise<SdkResponse<GroupMemberItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_group_member_owner_and_admin(
          openIMSdk.baseCallbackWrap<GroupMemberItem[]>(resolve, reject),
          opid,
          groupID
        );
      }),

    getGroupMemberListByJoinTimeFilter: (
      params: GetGroupMemberListByJoinTimeFilterParams,
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<GroupMemberItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_group_member_list_by_join_time_filter(
          openIMSdk.baseCallbackWrap<GroupMemberItem[]>(resolve, reject),
          opid,
          params.groupID,
          params.offset,
          params.count,
          params.joinTimeBegin,
          params.joinTimeEnd,
          JSON.stringify(params.filterUserIDList)
        );
      }),

    kickGroupMember: (params: GroupMemberOperationParams, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.kick_group_member(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.groupID,
          params.reason,
          JSON.stringify(params.userIDList)
        );
      }),

    changeGroupMemberMute: (
      params: ChangeGroupMemberMuteParams,
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.change_group_member_mute(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.groupID,
          params.userID,
          params.mutedSeconds
        );
      }),

    changeGroupMute: (params: ChangeGroupMuteParams, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.change_group_mute(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.groupID,
          params.isMute ? 1 : 0
        );
      }),

    transferGroupOwner: (params: TransferGroupOwnerParams, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.transfer_group_owner(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.groupID,
          params.newOwnerUserID
        );
      }),

    dismissGroup: (groupID: string, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.dismiss_group(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          groupID
        );
      }),

    quitGroup: (groupID: string, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.quit_group(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          groupID
        );
      }),

    isJoinGroup: (groupID: string, opid = uuidV4()) =>
      new Promise<SdkResponse<boolean>>((resolve, reject) => {
        openIMSdk.nativeSdk.is_join_group(
          openIMSdk.baseCallbackWrap<boolean>(resolve, reject),
          opid,
          groupID
        );
      }),
    getUsersInGroup: (params: GroupMemberUserListParams, opid = uuidV4()) =>
      new Promise<SdkResponse<string[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_users_in_group(
          openIMSdk.baseCallbackWrap<string[]>(resolve, reject),
          opid,
          params.groupID,
          JSON.stringify(params.userIDList)
        );
      }),
  };
}

export interface GroupModuleApi {
  createGroup: (
    params: CreateGroupParams,
    opid?: string
  ) => Promise<SdkResponse<GroupItem>>;
  joinGroup: (
    params: JoinGroupParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  inviteUserToGroup: (
    params: GroupMemberOperationParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  getJoinedGroupList: (opid?: string) => Promise<SdkResponse<GroupItem[]>>;
  getJoinedGroupListPage: (
    params: PaginationParams,
    opid?: string
  ) => Promise<SdkResponse<GroupItem[]>>;
  searchGroups: (
    params: SearchGroupsParams,
    opid?: string
  ) => Promise<SdkResponse<GroupItem[]>>;
  getSpecifiedGroupsInfo: (
    groupIDList: string[],
    opid?: string
  ) => Promise<SdkResponse<GroupItem[]>>;
  setGroupInfo: (
    params: Partial<GroupItem> & { groupID: string },
    opid?: string
  ) => Promise<SdkResponse<void>>;
  getGroupApplicationListAsRecipient: (
    params?: GroupApplicationListParams,
    opid?: string
  ) => Promise<SdkResponse<GroupApplicationItem[]>>;
  getGroupApplicationListAsApplicant: (
    params?: GroupApplicationListParams,
    opid?: string
  ) => Promise<SdkResponse<GroupApplicationItem[]>>;
  getGroupApplicationUnhandledCount: (
    params: ApplicationUnhandledCountParams,
    opid?: string
  ) => Promise<SdkResponse<number>>;
  acceptGroupApplication: (
    params: HandleGroupApplicationParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  refuseGroupApplication: (
    params: HandleGroupApplicationParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  getGroupMemberList: (
    params: GetGroupMemberListParams,
    opid?: string
  ) => Promise<SdkResponse<GroupMemberItem[]>>;
  getSpecifiedGroupMembersInfo: (
    params: GroupMemberUserListParams,
    opid?: string
  ) => Promise<SdkResponse<GroupMemberItem[]>>;
  searchGroupMembers: (
    params: SearchGroupMembersParams,
    opid?: string
  ) => Promise<SdkResponse<GroupMemberItem[]>>;
  setGroupMemberInfo: (
    params: SetGroupMemberInfoParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  getGroupMemberOwnerAndAdmin: (
    groupID: string,
    opid?: string
  ) => Promise<SdkResponse<GroupMemberItem[]>>;
  getGroupMemberListByJoinTimeFilter: (
    params: GetGroupMemberListByJoinTimeFilterParams,
    opid?: string
  ) => Promise<SdkResponse<GroupMemberItem[]>>;
  kickGroupMember: (
    params: GroupMemberOperationParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  changeGroupMemberMute: (
    params: ChangeGroupMemberMuteParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  changeGroupMute: (
    params: ChangeGroupMuteParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  transferGroupOwner: (
    params: TransferGroupOwnerParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  dismissGroup: (groupID: string, opid?: string) => Promise<SdkResponse<void>>;
  quitGroup: (groupID: string, opid?: string) => Promise<SdkResponse<void>>;
  isJoinGroup: (
    groupID: string,
    opid?: string
  ) => Promise<SdkResponse<boolean>>;
  getUsersInGroup: (
    params: GroupMemberUserListParams,
    opid?: string
  ) => Promise<SdkResponse<string[]>>;
}
