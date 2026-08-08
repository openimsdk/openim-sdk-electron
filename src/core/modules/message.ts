import { uuidV4 } from '@/utils/uuid';
import OpenIMSdk from '..';
import { SdkResponse } from '@/types/entity';
import {
  MessageItem,
  CardElem,
  AdvancedMessageListResult,
  SearchMessageResult,
  CreateAdvancedQuoteMessageParams,
  CreateAdvancedTextMessageParams,
  CreateTextAtMessageParams,
  CreateLocationMessageParams,
  CreateCustomMessageParams,
  CreateQuoteMessageParams,
  CreateMergerMessageParams,
  CreateFaceMessageParams,
  SendMessageParams,
  SearchLocalMessagesParams,
  GetAdvancedHistoryMessageListParams,
  FindMessageQuery,
  InsertGroupMessageToLocalStorageParams,
  InsertSingleMessageToLocalStorageParams,
  SetMessageLocalExParams,
  ConversationMessageParams,
  CreateImageMessageByURLParams,
  CreateVideoMessageByURLParams,
  CreateFileMessageByURLParams,
  CreateSoundMessageByURLParams,
} from '@openim/wasm-client-sdk';

export function setupMessageModule(openIMSdk: OpenIMSdk) {
  return {
    createTextMessage: (content: string, opid = uuidV4()) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_text_message(opid, content)
      ),

    createAdvancedTextMessage: (
      params: CreateAdvancedTextMessageParams,
      opid = uuidV4()
    ) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_advanced_text_message(
          opid,
          params.text,
          JSON.stringify(params.messageEntityList ?? [])
        )
      ),

    createAdvancedQuoteMessage: (
      params: CreateAdvancedQuoteMessageParams,
      opid = uuidV4()
    ) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_advanced_quote_message(
          opid,
          params.text,
          JSON.stringify(params.message),
          JSON.stringify(params.messageEntityList ?? [])
        )
      ),

    createTextAtMessage: (params: CreateTextAtMessageParams, opid = uuidV4()) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_text_at_message(
          opid,
          params.text,
          JSON.stringify(params.atUserIDList),
          JSON.stringify(params.atUsersInfo ?? []),
          JSON.stringify(params.message ?? {})
        )
      ),

    createLocationMessage: (
      params: CreateLocationMessageParams,
      opid = uuidV4()
    ) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_location_message(
          opid,
          params.description,
          params.longitude,
          params.latitude
        )
      ),

    createCustomMessage: (params: CreateCustomMessageParams, opid = uuidV4()) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_custom_message(
          opid,
          params.data,
          params.extension,
          params.description
        )
      ),

    createQuoteMessage: (params: CreateQuoteMessageParams, opid = uuidV4()) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_quote_message(
          opid,
          params.text,
          params.message
        )
      ),

    createCardMessage: (params: CardElem, opid = uuidV4()) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_card_message(opid, JSON.stringify(params))
      ),

    createMergerMessage: (params: CreateMergerMessageParams, opid = uuidV4()) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_merger_message(
          opid,
          JSON.stringify(params.messageList),
          params.title,
          JSON.stringify(params.summaryList)
        )
      ),

    createFaceMessage: (params: CreateFaceMessageParams, opid = uuidV4()) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_face_message(opid, params.index, params.data)
      ),

    createForwardMessage: (message: MessageItem, opid = uuidV4()) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_forward_message(
          opid,
          JSON.stringify(message)
        )
      ),

    createImageMessage: (imagePath: string, opid = uuidV4()) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_image_message(opid, imagePath)
      ),

    createImageMessageFromFullPath: (imagePath: string, opid = uuidV4()) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_image_message_from_full_path(opid, imagePath)
      ),

    createImageMessageByURL: (
      params: CreateImageMessageByURLParams,
      opid = uuidV4()
    ) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_image_message_by_url(
          opid,
          params.sourcePath,
          JSON.stringify(params.sourcePicture),
          JSON.stringify(params.bigPicture),
          JSON.stringify(params.snapshotPicture)
        )
      ),

    createVideoMessage: (
      videoPath: string,
      videoType: string,
      duration: number,
      snapshotPath: string,
      opid = uuidV4()
    ) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_video_message(
          opid,
          videoPath,
          videoType,
          duration,
          snapshotPath
        )
      ),

    createVideoMessageFromFullPath: (
      videoPath: string,
      videoType: string,
      duration: number,
      snapshotPath: string,
      opid = uuidV4()
    ) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_video_message_from_full_path(
          opid,
          videoPath,
          videoType,
          duration,
          snapshotPath
        )
      ),

    createVideoMessageByURL: (
      params: CreateVideoMessageByURLParams,
      opid = uuidV4()
    ) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_video_message_by_url(
          opid,
          JSON.stringify(params)
        )
      ),

    createSoundMessage: (
      soundPath: string,
      duration: number,
      opid = uuidV4()
    ) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_sound_message(opid, soundPath, duration)
      ),

    createSoundMessageFromFullPath: (
      soundPath: string,
      duration: number,
      opid = uuidV4()
    ) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_sound_message_from_full_path(
          opid,
          soundPath,
          duration
        )
      ),

    createSoundMessageByURL: (
      params: CreateSoundMessageByURLParams,
      opid = uuidV4()
    ) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_sound_message_by_url(
          opid,
          JSON.stringify(params)
        )
      ),

    createFileMessage: (filePath: string, fileName: string, opid = uuidV4()) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_file_message(opid, filePath, fileName)
      ),

    createFileMessageFromFullPath: (
      filePath: string,
      fileName: string,
      opid = uuidV4()
    ) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_file_message_from_full_path(
          opid,
          filePath,
          fileName
        )
      ),

    createFileMessageByURL: (
      params: CreateFileMessageByURLParams,
      opid = uuidV4()
    ) =>
      openIMSdk.asyncReturnWrap<MessageItem>(
        opid,
        openIMSdk.nativeSdk.create_file_message_by_url(
          opid,
          JSON.stringify(params)
        )
      ),

    sendMessage: (params: SendMessageParams, opid = uuidV4()) =>
      new Promise<SdkResponse<MessageItem>>((resolve, reject) => {
        const offlinePushInfo = params.offlinePushInfo ?? {
          title: 'You has a new message.',
          desc: 'You has a new message.',
          ex: '',
          iOSPushSound: '+1',
          iOSBadgeCount: true,
        };
        openIMSdk.nativeSdk.send_message(
          openIMSdk.sendMessageCallbackWrap<MessageItem>(
            params.message.clientMsgID ?? '',
            resolve,
            reject
          ),
          opid,
          JSON.stringify(params.message),
          params.recvID,
          params.groupID,
          JSON.stringify(offlinePushInfo),
          Number(!!params.isOnlineOnly)
        );
      }),

    sendMessageNotOss: (params: SendMessageParams, opid = uuidV4()) =>
      new Promise<SdkResponse<MessageItem>>((resolve, reject) => {
        const offlinePushInfo = params.offlinePushInfo ?? {
          title: 'You has a new message.',
          desc: 'You has a new message.',
          ex: '',
          iOSPushSound: '+1',
          iOSBadgeCount: true,
        };
        openIMSdk.nativeSdk.send_message_not_oss(
          openIMSdk.sendMessageCallbackWrap<MessageItem>(
            params.message.clientMsgID ?? '',
            resolve,
            reject
          ),
          opid,
          JSON.stringify(params.message),
          params.recvID,
          params.groupID,
          JSON.stringify(offlinePushInfo),
          Number(!!params.isOnlineOnly)
        );
      }),

    revokeMessage: (params: ConversationMessageParams, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.revoke_message(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.conversationID,
          params.clientMsgID
        );
      }),

    deleteMessage: (params: ConversationMessageParams, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.delete_message(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.conversationID,
          params.clientMsgID
        );
      }),

    deleteMessageFromLocalStorage: (
      params: ConversationMessageParams,
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.delete_message_from_local_storage(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.conversationID,
          params.clientMsgID
        );
      }),

    deleteAllMsgFromLocal: (opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.delete_all_msg_from_local(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid
        );
      }),

    deleteAllMsgFromLocalAndSvr: (opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.delete_all_msg_from_local_and_svr(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid
        );
      }),

    searchLocalMessages: (params: SearchLocalMessagesParams, opid = uuidV4()) =>
      new Promise<SdkResponse<SearchMessageResult>>((resolve, reject) => {
        openIMSdk.nativeSdk.search_local_messages(
          openIMSdk.baseCallbackWrap<SearchMessageResult>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getAdvancedHistoryMessageList: (
      params: GetAdvancedHistoryMessageListParams,
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<AdvancedMessageListResult>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_advanced_history_message_list(
          openIMSdk.baseCallbackWrap<AdvancedMessageListResult>(
            resolve,
            reject
          ),
          opid,
          JSON.stringify(params)
        );
      }),

    getAdvancedHistoryMessageListReverse: (
      params: GetAdvancedHistoryMessageListParams,
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<AdvancedMessageListResult>>((resolve, reject) => {
        openIMSdk.nativeSdk.get_advanced_history_message_list_reverse(
          openIMSdk.baseCallbackWrap<AdvancedMessageListResult>(
            resolve,
            reject
          ),
          opid,
          JSON.stringify(params)
        );
      }),
    findMessageList: (params: FindMessageQuery[], opid = uuidV4()) =>
      new Promise<SdkResponse<SearchMessageResult>>((resolve, reject) => {
        openIMSdk.nativeSdk.find_message_list(
          openIMSdk.baseCallbackWrap<SearchMessageResult>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getAtAllTag: (opid = uuidV4()) =>
      openIMSdk.asyncReturnWrap<string>(
        opid,
        openIMSdk.nativeSdk.get_at_all_tag(opid)
      ),
    insertGroupMessageToLocalStorage: (
      params: InsertGroupMessageToLocalStorageParams,
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<MessageItem>>((resolve, reject) => {
        openIMSdk.nativeSdk.insert_group_message_to_local_storage(
          openIMSdk.baseCallbackWrap<MessageItem>(resolve, reject),
          opid,
          JSON.stringify(params.message),
          params.groupID,
          params.sendID
        );
      }),
    insertSingleMessageToLocalStorage: (
      params: InsertSingleMessageToLocalStorageParams,
      opid = uuidV4()
    ) =>
      new Promise<SdkResponse<MessageItem>>((resolve, reject) => {
        openIMSdk.nativeSdk.insert_single_message_to_local_storage(
          openIMSdk.baseCallbackWrap<MessageItem>(resolve, reject),
          opid,
          JSON.stringify(params.message),
          params.recvID,
          params.sendID
        );
      }),
    setMessageLocalEx: (params: SetMessageLocalExParams, opid = uuidV4()) =>
      new Promise<SdkResponse<void>>((resolve, reject) => {
        openIMSdk.nativeSdk.set_message_local_ex(
          openIMSdk.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.conversationID,
          params.clientMsgID,
          params.localEx
        );
      }),
  };
}

export interface MessageModuleApi {
  createTextMessage: (
    content: string,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createAdvancedTextMessage: (
    params: CreateAdvancedTextMessageParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createAdvancedQuoteMessage: (
    params: CreateAdvancedQuoteMessageParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createTextAtMessage: (
    params: CreateTextAtMessageParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createLocationMessage: (
    params: CreateLocationMessageParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createCustomMessage: (
    params: CreateCustomMessageParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createQuoteMessage: (
    params: CreateQuoteMessageParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createCardMessage: (
    params: CardElem,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createMergerMessage: (
    params: CreateMergerMessageParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createFaceMessage: (
    params: CreateFaceMessageParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createForwardMessage: (
    message: MessageItem,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createImageMessage: (
    imagePath: string,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createImageMessageFromFullPath: (
    imagePath: string,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createImageMessageByURL: (
    params: CreateImageMessageByURLParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createVideoMessage: (
    videoPath: string,
    videoType: string,
    duration: number,
    snapshotPath: string,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createVideoMessageFromFullPath: (
    videoPath: string,
    videoType: string,
    duration: number,
    snapshotPath: string,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createVideoMessageByURL: (
    params: CreateVideoMessageByURLParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createSoundMessage: (
    soundPath: string,
    duration: number,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createSoundMessageFromFullPath: (
    soundPath: string,
    duration: number,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createSoundMessageByURL: (
    params: CreateSoundMessageByURLParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createFileMessage: (
    filePath: string,
    fileName: string,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createFileMessageFromFullPath: (
    filePath: string,
    fileName: string,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  createFileMessageByURL: (
    params: CreateFileMessageByURLParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  sendMessage: (
    params: SendMessageParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  sendMessageNotOss: (
    params: SendMessageParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  revokeMessage: (
    params: ConversationMessageParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  deleteMessage: (
    params: ConversationMessageParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  deleteMessageFromLocalStorage: (
    params: ConversationMessageParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
  deleteAllMsgFromLocal: (opid?: string) => Promise<SdkResponse<void>>;
  deleteAllMsgFromLocalAndSvr: (opid?: string) => Promise<SdkResponse<void>>;
  searchLocalMessages: (
    params: SearchLocalMessagesParams,
    opid?: string
  ) => Promise<SdkResponse<SearchMessageResult>>;
  getAdvancedHistoryMessageList: (
    params: GetAdvancedHistoryMessageListParams,
    opid?: string
  ) => Promise<SdkResponse<AdvancedMessageListResult>>;
  getAdvancedHistoryMessageListReverse: (
    params: GetAdvancedHistoryMessageListParams,
    opid?: string
  ) => Promise<SdkResponse<AdvancedMessageListResult>>;
  findMessageList: (
    params: FindMessageQuery[],
    opid?: string
  ) => Promise<SdkResponse<SearchMessageResult>>;
  getAtAllTag: (opid?: string) => Promise<SdkResponse<string>>;
  insertGroupMessageToLocalStorage: (
    params: InsertGroupMessageToLocalStorageParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  insertSingleMessageToLocalStorage: (
    params: InsertSingleMessageToLocalStorageParams,
    opid?: string
  ) => Promise<SdkResponse<MessageItem>>;
  setMessageLocalEx: (
    params: SetMessageLocalExParams,
    opid?: string
  ) => Promise<SdkResponse<void>>;
}
