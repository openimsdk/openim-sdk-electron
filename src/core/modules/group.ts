import { v4 as uuidV4 } from 'uuid';
import { BaseResponse } from '@/types/entity';
import OpenIMSDK from '..';
import {
  GroupItem,
  GroupApplicationItem,
  GroupMemberItem,
} from 'open-im-sdk-wasm/lib/types/entity';
import {
  CreateGroupParams,
  JoinGroupParams,
  SearchGroupParams,
  AccessGroupApplicationParams,
  GetGroupMemberParams,
  SearchGroupMemberParams,
  UpdateMemberInfoParams,
  GetGroupMemberByTimeParams,
  ChangeGroupMemberMuteParams,
  ChangeGroupMuteParams,
  TransferGroupParams,
  AccessToGroupParams,
} from 'open-im-sdk-wasm/lib/types/params';

export function setupGroupModule(openIMSDK: OpenIMSDK) {
  return {
    createGroup: (params: CreateGroupParams, opid = uuidV4()) =>
      new Promise<BaseResponse<GroupItem>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.create_group(
          openIMSDK.baseCallbackWrap<GroupItem>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    joinGroup: (params: JoinGroupParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.join_group(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.groupID,
          params.reqMsg,
          params.joinSource,
          params.ex ?? ''
        );
      }),

    inviteUserToGroup: (params: AccessToGroupParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.invite_user_to_group(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.groupID,
          params.reason,
          JSON.stringify(params.userIDList)
        );
      }),

    getJoinedGroupList: (opid = uuidV4()) =>
      new Promise<BaseResponse<GroupItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_joined_group_list(
          openIMSDK.baseCallbackWrap<GroupItem[]>(resolve, reject),
          opid
        );
      }),

    searchGroups: (params: SearchGroupParams, opid = uuidV4()) =>
      new Promise<BaseResponse<GroupItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.search_groups(
          openIMSDK.baseCallbackWrap<GroupItem[]>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getSpecifiedGroupsInfo: (groupIDList: string[], opid = uuidV4()) =>
      new Promise<BaseResponse<GroupItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_specified_groups_info(
          openIMSDK.baseCallbackWrap<GroupItem[]>(resolve, reject),
          opid,
          JSON.stringify(groupIDList)
        );
      }),

    setGroupInfo: (params: Partial<GroupItem>, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.set_group_info(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getGroupApplicationListAsRecipient: (opid = uuidV4()) =>
      new Promise<BaseResponse<GroupApplicationItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_group_application_list_as_recipient(
          openIMSDK.baseCallbackWrap<GroupApplicationItem[]>(resolve, reject),
          opid
        );
      }),

    getGroupApplicationListAsApplicant: (opid = uuidV4()) =>
      new Promise<BaseResponse<GroupApplicationItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_group_application_list_as_applicant(
          openIMSDK.baseCallbackWrap<GroupApplicationItem[]>(resolve, reject),
          opid
        );
      }),

    acceptGroupApplication: (
      params: AccessGroupApplicationParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.accept_group_application(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.groupID,
          params.fromUserID,
          params.handleMsg
        );
      }),

    refuseGroupApplication: (
      params: AccessGroupApplicationParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.refuse_group_application(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.groupID,
          params.fromUserID,
          params.handleMsg
        );
      }),

    getGroupMemberList: (params: GetGroupMemberParams, opid = uuidV4()) =>
      new Promise<BaseResponse<GroupMemberItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_group_member_list(
          openIMSDK.baseCallbackWrap<GroupMemberItem[]>(resolve, reject),
          opid,
          params.groupID,
          params.filter,
          params.offset,
          params.count
        );
      }),

    getSpecifiedGroupMembersInfo: (
      params: Omit<AccessToGroupParams, 'reason'>,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<GroupMemberItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_specified_group_members_info(
          openIMSDK.baseCallbackWrap<GroupMemberItem[]>(resolve, reject),
          opid,
          params.groupID,
          JSON.stringify(params.userIDList)
        );
      }),

    searchGroupMembers: (params: SearchGroupMemberParams, opid = uuidV4()) =>
      new Promise<BaseResponse<GroupMemberItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.search_group_members(
          openIMSDK.baseCallbackWrap<GroupMemberItem[]>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    setGroupMemberInfo: (params: UpdateMemberInfoParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.set_group_member_info(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getGroupMemberOwnerAndAdmin: (groupID: string, opid = uuidV4()) =>
      new Promise<BaseResponse<GroupMemberItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_group_member_owner_and_admin(
          openIMSDK.baseCallbackWrap<GroupMemberItem[]>(resolve, reject),
          opid,
          groupID
        );
      }),

    getGroupMemberListByJoinTimeFilter: (
      params: GetGroupMemberByTimeParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<GroupMemberItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_group_member_list_by_join_time_filter(
          openIMSDK.baseCallbackWrap<GroupMemberItem[]>(resolve, reject),
          opid,
          params.groupID,
          params.offset,
          params.count,
          params.joinTimeBegin,
          params.joinTimeEnd,
          JSON.stringify(params.filterUserIDList)
        );
      }),

    kickGroupMember: (params: AccessToGroupParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.kick_group_member(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
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
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.change_group_member_mute(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.groupID,
          params.userID,
          params.mutedSeconds
        );
      }),

    changeGroupMute: (params: ChangeGroupMuteParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.change_group_mute(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.groupID,
          params.isMute ? 1 : 0
        );
      }),

    transferGroupOwner: (params: TransferGroupParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.transfer_group_owner(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.groupID,
          params.newOwnerUserID
        );
      }),

    dismissGroup: (groupID: string, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.dismiss_group(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          groupID
        );
      }),

    quitGroup: (groupID: string, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.quit_group(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          groupID
        );
      }),

    isJoinGroup: (groupID: string, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.is_join_group(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          groupID
        );
      }),
  };
}

export interface GroupModuleApi {
  createGroup: (
    params: CreateGroupParams,
    opid?: string
  ) => Promise<BaseResponse<GroupItem>>;
  joinGroup: (
    params: JoinGroupParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  inviteUserToGroup: (
    params: AccessToGroupParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  getJoinedGroupList: (opid?: string) => Promise<BaseResponse<GroupItem[]>>;
  searchGroups: (
    params: SearchGroupParams,
    opid?: string
  ) => Promise<BaseResponse<GroupItem[]>>;
  getSpecifiedGroupsInfo: (
    groupIDList: string[],
    opid?: string
  ) => Promise<BaseResponse<GroupItem[]>>;
  setGroupInfo: (
    params: Partial<GroupItem>,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  getGroupApplicationListAsRecipient: (
    opid?: string
  ) => Promise<BaseResponse<GroupApplicationItem[]>>;
  getGroupApplicationListAsApplicant: (
    opid?: string
  ) => Promise<BaseResponse<GroupApplicationItem[]>>;
  acceptGroupApplication: (
    params: AccessGroupApplicationParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  refuseGroupApplication: (
    params: AccessGroupApplicationParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  getGroupMemberList: (
    params: GetGroupMemberParams,
    opid?: string
  ) => Promise<BaseResponse<GroupMemberItem[]>>;
  getSpecifiedGroupMembersInfo: (
    params: Omit<AccessToGroupParams, 'reason'>,
    opid?: string
  ) => Promise<BaseResponse<GroupMemberItem[]>>;
  searchGroupMembers: (
    params: SearchGroupMemberParams,
    opid?: string
  ) => Promise<BaseResponse<GroupMemberItem[]>>;
  setGroupMemberInfo: (
    params: UpdateMemberInfoParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  getGroupMemberOwnerAndAdmin: (
    groupID: string,
    opid?: string
  ) => Promise<BaseResponse<GroupMemberItem[]>>;
  getGroupMemberListByJoinTimeFilter: (
    params: GetGroupMemberByTimeParams,
    opid?: string
  ) => Promise<BaseResponse<GroupMemberItem[]>>;
  kickGroupMember: (
    params: AccessToGroupParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  changeGroupMemberMute: (
    params: ChangeGroupMemberMuteParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  changeGroupMute: (
    params: ChangeGroupMuteParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  transferGroupOwner: (
    params: TransferGroupParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  dismissGroup: (groupID: string, opid?: string) => Promise<BaseResponse<void>>;
  quitGroup: (groupID: string, opid?: string) => Promise<BaseResponse<void>>;
  isJoinGroup: (groupID: string, opid?: string) => Promise<BaseResponse<void>>;
}
