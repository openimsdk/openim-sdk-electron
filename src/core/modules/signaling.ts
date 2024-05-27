import { v4 as uuidV4 } from 'uuid';
import OpenIMSDK from '..';
import { BaseResponse } from '@/types/entity';
import {
  CreateMeetingParams,
  CustomSignalParams,
  MeetingOperateStreamParams,
  RtcActionParams,
  SignalingInviteParams,
  UpdateMeetingParams,
} from 'open-im-sdk-wasm/lib/types/params';
import {
  RtcInviteResults,
  CallingRoomData,
  MeetingRecord,
} from 'open-im-sdk-wasm/lib/types/entity';

export function setupSignalingModule(openIMSDK: OpenIMSDK) {
  return {
    signalingInviteInGroup: (params: SignalingInviteParams, opid = uuidV4()) =>
      new Promise<BaseResponse<RtcInviteResults>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.signaling_invite_in_group(
          openIMSDK.baseCallbackWrap<RtcInviteResults>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),
    signalingInvite: (params: SignalingInviteParams, opid = uuidV4()) =>
      new Promise<BaseResponse<RtcInviteResults>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.signaling_invite(
          openIMSDK.baseCallbackWrap<RtcInviteResults>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),
    signalingCancel: (params: RtcActionParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.signaling_cancel(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),
    signalingAccept: (params: RtcActionParams, opid = uuidV4()) =>
      new Promise<BaseResponse<RtcInviteResults>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.signaling_accept(
          openIMSDK.baseCallbackWrap<RtcInviteResults>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),
    signalingReject: (params: RtcActionParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.signaling_reject(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),
    signalingHungUp: (params: RtcActionParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.signaling_hung_up(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),
    signalingGetRoomByGroupID: (groupID: string, opid = uuidV4()) =>
      new Promise<BaseResponse<CallingRoomData>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.signaling_get_room_by_group_id(
          openIMSDK.baseCallbackWrap<CallingRoomData>(resolve, reject),
          opid,
          groupID
        );
      }),
    signalingGetTokenByRoomID: (roomID: string, opid = uuidV4()) =>
      new Promise<BaseResponse<RtcInviteResults>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.signaling_get_token_by_room_id(
          openIMSDK.baseCallbackWrap<RtcInviteResults>(resolve, reject),
          opid,
          roomID
        );
      }),
    signalingSendCustomSignal: (params: CustomSignalParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.signaling_send_custom_signal(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params.customInfo),
          params.roomID
        );
      }),
    signalingCreateMeeting: (params: CreateMeetingParams, opid = uuidV4()) =>
      new Promise<BaseResponse<RtcInviteResults>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.signaling_create_meeting(
          openIMSDK.baseCallbackWrap<RtcInviteResults>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),
    signalingJoinMeeting: (roomID: string, opid = uuidV4()) =>
      new Promise<BaseResponse<RtcInviteResults>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.signaling_join_meeting(
          openIMSDK.baseCallbackWrap<RtcInviteResults>(resolve, reject),
          opid,
          JSON.stringify({
            roomID,
          })
        );
      }),
    signalingUpdateMeetingInfo: (
      params: Partial<UpdateMeetingParams> & { roomID: string },
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.signaling_update_meeting_info(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),
    signalingCloseRoom: (roomID: string, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.signaling_close_room(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          roomID
        );
      }),
    signalingGetMeetings: (opid = uuidV4()) =>
      new Promise<BaseResponse<{ meetingInfoList: MeetingRecord[] }>>(
        (resolve, reject) => {
          openIMSDK.libOpenIMSDK.signaling_get_meetings(
            openIMSDK.baseCallbackWrap<{ meetingInfoList: MeetingRecord[] }>(
              resolve,
              reject
            ),
            opid
          );
        }
      ),
    signalingOperateStream: (
      params: MeetingOperateStreamParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.signaling_operate_stream(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.streamType,
          params.roomID,
          params.userID ?? '',
          params.mute ? 1 : 0,
          params.muteAll ? 1 : 0
        );
      }),
  };
}

export interface SignalingModuleApi {
  signalingInviteInGroup: (
    params: SignalingInviteParams,
    opid?: string
  ) => Promise<BaseResponse<RtcInviteResults>>;
  signalingInvite: (
    params: SignalingInviteParams,
    opid?: string
  ) => Promise<BaseResponse<RtcInviteResults>>;
  signalingCancel: (
    params: RtcActionParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  signalingAccept: (
    params: RtcActionParams,
    opid?: string
  ) => Promise<BaseResponse<RtcInviteResults>>;
  signalingReject: (
    params: RtcActionParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  signalingHungUp: (
    params: RtcActionParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  signalingGetRoomByGroupID: (
    groupID: string,
    opid?: string
  ) => Promise<BaseResponse<CallingRoomData>>;
  signalingGetTokenByRoomID: (
    roomID: string,
    opid?: string
  ) => Promise<BaseResponse<RtcInviteResults>>;
  signalingSendCustomSignal: (
    params: CustomSignalParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  signalingCreateMeeting: (
    params: CreateMeetingParams,
    opid?: string
  ) => Promise<BaseResponse<RtcInviteResults>>;
  signalingJoinMeeting: (
    meetingID: string,
    opid?: string
  ) => Promise<BaseResponse<RtcInviteResults>>;
  signalingUpdateMeetingInfo: (
    params: Partial<UpdateMeetingParams> & { roomID: string },
    opid?: string
  ) => Promise<BaseResponse<void>>;
  signalingCloseRoom: (
    roomID: string,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  signalingGetMeetings: (
    opid?: string
  ) => Promise<BaseResponse<{ meetingInfoList: MeetingRecord[] }>>;
  signalingOperateStream: (
    params: MeetingOperateStreamParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
}
