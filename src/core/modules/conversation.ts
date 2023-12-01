import { v4 as uuidV4 } from 'uuid';
import { BaseResponse, ConversationItem } from '@/types/entity';
import OpenIMSDK from '..';

export function setupConversationModule(openIMSDK: OpenIMSDK) {
  return {
    // getAllConversationList: (opid = uuidV4()) =>
    //   new Promise<BaseResponse<ConversationItem[]>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.get_all_conversation_list(
    //       openIMSDK.baseCallbackWrap<ConversationItem[]>(resolve, reject),
    //       opid
    //     );
    //   }),
    // getConversationListSplit: (
    //   params: SplitConversationParams,
    //   opid = uuidV4()
    // ) =>
    //   new Promise<BaseResponse<ConversationItem[]>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.get_conversation_list_split(
    //       openIMSDK.baseCallbackWrap<ConversationItem[]>(resolve, reject),
    //       opid,
    //       params.offset,
    //       params.count
    //     );
    //   }),
    // getOneConversation: (params: GetOneConversationParams, opid = uuidV4()) =>
    //   new Promise<BaseResponse<ConversationItem>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.get_one_conversation(
    //       openIMSDK.baseCallbackWrap<ConversationItem>(resolve, reject),
    //       opid,
    //       params.sessionType,
    //       params.sourceID
    //     );
    //   }),
    // getMultipleConversation: (conversationIDList: string, opid = uuidV4()) =>
    //   new Promise<BaseResponse<ConversationItem[]>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.get_multiple_conversation(
    //       openIMSDK.baseCallbackWrap<ConversationItem[]>(resolve, reject),
    //       opid,
    //       conversationIDList
    //     );
    //   }),
    // getConversationIDBySessionType: (
    //   params: GetOneConversationParams,
    //   opid = uuidV4()
    // ) =>
    //   new Promise<BaseResponse<ConversationItem>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.get_conversation_id_by_session_type(
    //       openIMSDK.baseCallbackWrap<ConversationItem>(resolve, reject),
    //       opid,
    //       params.sourceID,
    //       params.sessionType
    //     );
    //   }),
    // getTotalUnreadMsgCount: (opid = uuidV4()) =>
    //   new Promise<BaseResponse<number>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.get_total_unread_msg_count(
    //       openIMSDK.baseCallbackWrap<number>(resolve, reject),
    //       opid
    //     );
    //   }),
    // markConversationMessageAsRead: (conversationID: string, opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.mark_conversation_message_as_read(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       conversationID
    //     );
    //   }),
    // setConversationDraft: (
    //   params: SetConversationDraftParams,
    //   opid = uuidV4()
    // ) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.set_conversation_draft(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       params.conversationID,
    //       params.draftText
    //     );
    //   }),
    // pinConversation: (params: PinConversationParams, opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.pin_conversation(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       params.conversationID,
    //       params.isPinned ? 1 : 0
    //     );
    //   }),
    // setConversationRecvMessageOpt: (
    //   params: SetConversationRecvOptParams,
    //   opid = uuidV4()
    // ) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.set_conversation_recv_message_opt(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       params.conversationID,
    //       params.opt
    //     );
    //   }),
    // setConversationPrivateChat: (
    //   params: SetConversationPrivateParams,
    //   opid = uuidV4()
    // ) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.set_conversation_private_chat(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       params.conversationID,
    //       params.isPrivate
    //     );
    //   }),
    // setConversationBurnDuration: (
    //   params: SetBurnDurationParams,
    //   opid = uuidV4()
    // ) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.set_conversation_burn_duration(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       params.conversationID,
    //       params.burnDuration
    //     );
    //   }),
    // resetConversationGroupAtType: (groupID: string, opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.reset_conversation_group_at_type(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       groupID
    //     );
    //   }),
    // hideConversation: (conversationID: string, opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.hide_conversation(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       conversationID
    //     );
    //   }),
    // hideAllConversation: (opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.hide_all_conversation(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid
    //     );
    //   }),
    // clearConversationAndDeleteAllMsg: (
    //   conversationID: string,
    //   opid = uuidV4()
    // ) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.clear_conversation_and_delete_all_msg(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       conversationID
    //     );
    //   }),
    // deleteConversationAndDeleteAllMsg: (
    //   conversationID: string,
    //   opid = uuidV4()
    // ) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.delete_conversation_and_delete_all_msg(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       conversationID
    //     );
    //   }),
  };
}

export interface ConversationModuleApi {
  getAllConversationList: (
    opid?: string
  ) => Promise<BaseResponse<ConversationItem[]>>;
}
