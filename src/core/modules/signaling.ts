import { v4 as uuidV4 } from 'uuid';
import OpenIMSDK from '..';
import { BaseResponse } from '@/types/entity';
import {
  CustomSignalParams,
  RtcActionParams,
  SignalingInviteParams,
} from '@openim/wasm-client-sdk/lib/types/params';
import {
  RtcInviteResults,
  CallingRoomData,
} from '@openim/wasm-client-sdk/lib/types/entity';

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
    getSignalingInvitationInfoStartApp: (opid = uuidV4()) =>
      new Promise<BaseResponse<RtcInviteResults>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_signaling_invitation_info_start_app(
          openIMSDK.baseCallbackWrap<RtcInviteResults>(resolve, reject),
          opid
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
  getSignalingInvitationInfoStartApp: (
    opid?: string
  ) => Promise<BaseResponse<RtcInviteResults>>;
  signalingSendCustomSignal: (
    params: CustomSignalParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
}
