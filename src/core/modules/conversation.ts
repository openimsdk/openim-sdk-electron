import { uuidV4 } from '@/utils/uuid';
import {
  ChangeInputStatesParams,
  ConversationItem,
  ConversationListPaginationParams,
  ConversationSessionParams,
  GetInputStatesParams,
  Platform,
  SetConversationDraftParams,
  SetConversationParams,
} from '@openim/wasm-client-sdk';
import { SdkResponse } from '@/types/entity';
import OpenIMSdk from '..';

export function setupConversationModule(openIMSdk: OpenIMSdk) {
  return {
    getAllConversationList: (operationID = uuidV4()) =>
      new Promise<SdkResponse<ConversationItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_all_conversation_list(
          openIMSdk.baseCallbackWrap<ConversationItem[]>(resolve, reject),
          operationID
        );
      }),

    getConversationListSplit: (
      params: ConversationListPaginationParams,
      operationID = uuidV4()
    ) =>
      new Promise<SdkResponse<ConversationItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_conversation_list_split(
          openIMSdk.baseCallbackWrap<ConversationItem[]>(resolve, reject),
          operationID,
          params.offset,
          params.count
        );
      }),

    getOneConversation: (
      params: ConversationSessionParams,
      operationID = uuidV4()
    ) =>
      new Promise<SdkResponse<ConversationItem>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_one_conversation(
          openIMSdk.baseCallbackWrap<ConversationItem>(resolve, reject),
          operationID,
          params.sessionType,
          params.sourceID
        );
      }),

    getMultipleConversation: (
      conversationIDList: string[],
      operationID = uuidV4()
    ) =>
      new Promise<SdkResponse<ConversationItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_multiple_conversation(
          openIMSdk.baseCallbackWrap<ConversationItem[]>(resolve, reject),
          operationID,
          JSON.stringify(conversationIDList)
        );
      }),

    searchConversation: (searchParam: string, operationID = uuidV4()) =>
      new Promise<SdkResponse<ConversationItem[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.search_conversation(
          openIMSdk.baseCallbackWrap<ConversationItem[]>(resolve, reject),
          operationID,
          searchParam
        );
      }),

    getTotalUnreadMsgCount: (operationID = uuidV4()) =>
      new Promise<SdkResponse<number>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_total_unread_msg_count(
          openIMSdk.baseCallbackWrap<number>(resolve, reject),
          operationID
        );
      }),

    markConversationMessageAsRead: (
      conversationID: string,
      operationID = uuidV4()
    ) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.mark_conversation_message_as_read(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          operationID,
          conversationID
        );
      }),

    markAllConversationMessageAsRead: (operationID = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.mark_all_conversation_message_as_read(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          operationID
        );
      }),

    setConversationDraft: (
      params: SetConversationDraftParams,
      operationID = uuidV4()
    ) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.set_conversation_draft(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          operationID,
          params.conversationID,
          params.draftText
        );
      }),

    setConversation: (params: SetConversationParams, operationID = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.set_conversation(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          operationID,
          params.conversationID,
          JSON.stringify(params)
        );
      }),

    hideConversation: (conversationID: string, operationID = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.hide_conversation(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          operationID,
          conversationID
        );
      }),

    hideAllConversations: (operationID = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.hide_all_conversations(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          operationID
        );
      }),

    clearConversationAndDeleteAllMsg: (
      conversationID: string,
      operationID = uuidV4()
    ) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.clear_conversation_and_delete_all_msg(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          operationID,
          conversationID
        );
      }),

    deleteConversationAndDeleteAllMsg: (
      conversationID: string,
      operationID = uuidV4()
    ) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.delete_conversation_and_delete_all_msg(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          operationID,
          conversationID
        );
      }),

    changeInputStates: (
      params: ChangeInputStatesParams,
      operationID = uuidV4()
    ) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.change_input_states(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          operationID,
          params.conversationID,
          params.focus ? 1 : 0
        );
      }),

    getInputStates: (params: GetInputStatesParams, operationID = uuidV4()) =>
      new Promise<SdkResponse<Platform[]>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_input_states(
          openIMSdk.baseCallbackWrap<Platform[]>(resolve, reject),
          operationID,
          params.conversationID,
          params.userID
        );
      }),
  };
}

export interface ConversationModuleApi {
  getAllConversationList: (
    operationID?: string
  ) => Promise<SdkResponse<ConversationItem[]>>;
  getConversationListSplit: (
    params: ConversationListPaginationParams,
    operationID?: string
  ) => Promise<SdkResponse<ConversationItem[]>>;
  getOneConversation: (
    params: ConversationSessionParams,
    operationID?: string
  ) => Promise<SdkResponse<ConversationItem>>;
  getMultipleConversation: (
    conversationIDList: string[],
    operationID?: string
  ) => Promise<SdkResponse<ConversationItem[]>>;
  searchConversation: (
    searchParam: string,
    operationID?: string
  ) => Promise<SdkResponse<ConversationItem[]>>;
  getTotalUnreadMsgCount: (
    operationID?: string
  ) => Promise<SdkResponse<number>>;
  markConversationMessageAsRead: (
    conversationID: string,
    operationID?: string
  ) => Promise<SdkResponse<void>>;
  markAllConversationMessageAsRead: (
    operationID?: string
  ) => Promise<SdkResponse<void>>;
  setConversationDraft: (
    params: SetConversationDraftParams,
    operationID?: string
  ) => Promise<SdkResponse<void>>;
  setConversation: (
    params: SetConversationParams,
    operationID?: string
  ) => Promise<SdkResponse<void>>;
  hideConversation: (
    conversationID: string,
    operationID?: string
  ) => Promise<SdkResponse<void>>;
  hideAllConversations: (operationID?: string) => Promise<SdkResponse<void>>;
  clearConversationAndDeleteAllMsg: (
    conversationID: string,
    operationID?: string
  ) => Promise<SdkResponse<void>>;
  deleteConversationAndDeleteAllMsg: (
    conversationID: string,
    operationID?: string
  ) => Promise<SdkResponse<void>>;
  changeInputStates: (
    params: ChangeInputStatesParams,
    operationID?: string
  ) => Promise<SdkResponse<void>>;
  getInputStates: (
    params: GetInputStatesParams,
    operationID?: string
  ) => Promise<SdkResponse<Platform[]>>;
}
