import { v4 as uuidV4 } from 'uuid';
import OpenIMSDK from '..';
import { BaseResponse } from '@/types/entity';
import {
  MessageItem,
  CardElem,
  AdvancedGetMessageResult,
} from '@openim/wasm-client-sdk/lib/types/entity';
import {
  AtMsgParams,
  LocationMsgParams,
  CustomMsgParams,
  QuoteMsgParams,
  MergerMsgParams,
  FaceMessageParams,
  SendMsgParams,
  TypingUpdateParams,
  SearchLocalParams,
  GetAdvancedHistoryMsgParams,
  FindMessageParams,
  InsertGroupMsgParams,
  InsertSingleMsgParams,
  SetMessageLocalExParams,
  AccessMessageParams,
  ImageMsgParamsByURL,
  VideoMsgParamsByURL,
  FileMsgParamsByURL,
  SoundMsgParamsByURL,
  SendGroupReadReceiptParams,
  GetGroupMessageReaderParams,
  FetchSurroundingParams,
} from '@openim/wasm-client-sdk/lib/types/params';
import {
  VideoMsgByPathParams,
  SoundMsgByPathParams,
  FileMsgByPathParams,
} from '@/types/params';

export function setupMessageModule(openIMSDK: OpenIMSDK) {
  return {
    createTextMessage: (content: string, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_text_message(opid, content)
      ),

    createTextAtMessage: (params: AtMsgParams, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_text_at_message(
          opid,
          params.text,
          JSON.stringify(params.atUserIDList),
          JSON.stringify(params.atUsersInfo),
          JSON.stringify(params.message)
        )
      ),

    createLocationMessage: (params: LocationMsgParams, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_location_message(
          opid,
          params.description,
          params.longitude,
          params.latitude
        )
      ),

    createCustomMessage: (params: CustomMsgParams, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_custom_message(
          opid,
          params.data,
          params.extension,
          params.description
        )
      ),

    createQuoteMessage: (params: QuoteMsgParams, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_quote_message(
          opid,
          params.text,
          params.message
        )
      ),

    createCardMessage: (params: CardElem, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_card_message(opid, JSON.stringify(params))
      ),

    createMergerMessage: (params: MergerMsgParams, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_merger_message(
          opid,
          JSON.stringify(params.messageList),
          params.title,
          JSON.stringify(params.summaryList)
        )
      ),

    createFaceMessage: (params: FaceMessageParams, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_face_message(
          opid,
          params.index,
          params.data
        )
      ),

    createForwardMessage: (message: MessageItem, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_forward_message(
          opid,
          JSON.stringify(message)
        )
      ),

    createImageMessage: (imagePath: string, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_image_message(opid, imagePath)
      ),

    createImageMessageFromFullPath: (imagePath: string, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_image_message_from_full_path(
          opid,
          imagePath
        )
      ),

    createImageMessageByURL: (params: ImageMsgParamsByURL, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_image_message_by_url(
          opid,
          params.sourcePath,
          JSON.stringify(params.sourcePicture),
          JSON.stringify(params.bigPicture),
          JSON.stringify(params.snapshotPicture)
        )
      ),

    createVideoMessage: (params: VideoMsgByPathParams, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_video_message(
          opid,
          params.videoPath,
          params.videoType,
          params.duration,
          params.snapshotPath
        )
      ),

    createVideoMessageFromFullPath: (
      params: VideoMsgByPathParams,
      opid = uuidV4()
    ) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_video_message_from_full_path(
          opid,
          params.videoPath,
          params.videoType,
          params.duration,
          params.snapshotPath
        )
      ),

    createVideoMessageByURL: (params: VideoMsgParamsByURL, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_video_message_by_url(
          opid,
          JSON.stringify(params)
        )
      ),

    createSoundMessage: (params: SoundMsgByPathParams, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_sound_message(
          opid,
          params.soundPath,
          params.duration
        )
      ),

    createSoundMessageFromFullPath: (
      params: SoundMsgByPathParams,
      opid = uuidV4()
    ) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_sound_message_from_full_path(
          opid,
          params.soundPath,
          params.duration
        )
      ),

    createSoundMessageByURL: (params: SoundMsgParamsByURL, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_sound_message_by_url(
          opid,
          JSON.stringify(params)
        )
      ),

    createFileMessage: (params: FileMsgByPathParams, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_file_message(
          opid,
          params.filePath,
          params.fileName
        )
      ),

    createFileMessageFromFullPath: (
      params: FileMsgByPathParams,
      opid = uuidV4()
    ) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_file_message_from_full_path(
          opid,
          params.filePath,
          params.fileName
        )
      ),

    createFileMessageByURL: (params: FileMsgParamsByURL, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_file_message_by_url(
          opid,
          JSON.stringify(params)
        )
      ),

    sendMessage: (params: SendMsgParams, opid = uuidV4()) =>
      new Promise<BaseResponse<MessageItem>>((resolve, reject) => {
        const offlinePushInfo = params.offlinePushInfo ?? {
          title: 'You has a new message.',
          desc: 'You has a new message.',
          ex: '',
          iOSPushSound: '+1',
          iOSBadgeCount: true,
        };
        openIMSDK.libOpenIMSDK.send_message(
          openIMSDK.sendMessageCallbackWrap<MessageItem>(
            params.message.clientMsgID,
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

    sendMessageNotOss: (params: SendMsgParams, opid = uuidV4()) =>
      new Promise<BaseResponse<MessageItem>>((resolve, reject) => {
        const offlinePushInfo = params.offlinePushInfo ?? {
          title: 'You has a new message.',
          desc: 'You has a new message.',
          ex: '',
          iOSPushSound: '+1',
          iOSBadgeCount: true,
        };
        openIMSDK.libOpenIMSDK.send_message_not_oss(
          openIMSDK.sendMessageCallbackWrap<MessageItem>(
            params.message.clientMsgID,
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

    typingStatusUpdate: (params: TypingUpdateParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.typing_status_update(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.recvID,
          params.msgTip
        );
      }),

    revokeMessage: (params: AccessMessageParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.revoke_message(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.conversationID,
          params.clientMsgID
        );
      }),

    deleteMessage: (params: AccessMessageParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.delete_message(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.conversationID,
          params.clientMsgID
        );
      }),

    deleteMessageFromLocalStorage: (
      params: AccessMessageParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.delete_message_from_local_storage(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.conversationID,
          params.clientMsgID
        );
      }),

    deleteAllMsgFromLocal: (opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.delete_all_msg_from_local(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid
        );
      }),

    deleteAllMsgFromLocalAndSvr: (opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.delete_all_msg_from_local_and_svr(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid
        );
      }),

    searchLocalMessages: (params: SearchLocalParams, opid = uuidV4()) =>
      new Promise<BaseResponse<MessageItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.search_local_messages(
          openIMSDK.baseCallbackWrap<MessageItem[]>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getAdvancedHistoryMessageList: (
      params: GetAdvancedHistoryMsgParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<AdvancedGetMessageResult>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_advanced_history_message_list(
          openIMSDK.baseCallbackWrap<AdvancedGetMessageResult>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),

    getAdvancedHistoryMessageListReverse: (
      params: GetAdvancedHistoryMsgParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<AdvancedGetMessageResult>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_advanced_history_message_list_reverse(
          openIMSDK.baseCallbackWrap<AdvancedGetMessageResult>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),
    fetchSurroundingMessages: (
      params: FetchSurroundingParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<{ messageList: MessageItem[] }>>(
        (resolve, reject) => {
          openIMSDK.libOpenIMSDK.fetch_surrounding_messages(
            openIMSDK.baseCallbackWrap<{ messageList: MessageItem[] }>(
              resolve,
              reject
            ),
            opid,
            JSON.stringify(params)
          );
        }
      ),
    findMessageList: (params: FindMessageParams[], opid = uuidV4()) =>
      new Promise<BaseResponse<MessageItem[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.find_message_list(
          openIMSDK.baseCallbackWrap<MessageItem[]>(resolve, reject),
          opid,
          JSON.stringify(params)
        );
      }),
    insertGroupMessageToLocalStorage: (
      params: InsertGroupMsgParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.insert_group_message_to_local_storage(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params.message),
          params.groupID,
          params.sendID
        );
      }),
    insertSingleMessageToLocalStorage: (
      params: InsertSingleMsgParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.insert_single_message_to_local_storage(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          JSON.stringify(params.message),
          params.recvID,
          params.sendID
        );
      }),
    setMessageLocalEx: (params: SetMessageLocalExParams, opid = uuidV4()) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.set_message_local_ex(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.conversationID,
          params.clientMsgID,
          params.localEx
        );
      }),
    sendGroupMessageReadReceipt: (
      params: SendGroupReadReceiptParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<void>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.send_group_message_read_receipt(
          openIMSDK.baseCallbackWrap<void>(resolve, reject),
          opid,
          params.conversationID,
          JSON.stringify(params.clientMsgIDList)
        );
      }),
    getGroupMessageReaderList: (
      params: GetGroupMessageReaderParams,
      opid = uuidV4()
    ) =>
      new Promise<BaseResponse<string[]>>((resolve, reject) => {
        openIMSDK.libOpenIMSDK.get_group_message_reader_list(
          openIMSDK.baseCallbackWrap<string[]>(resolve, reject),
          opid,
          params.conversationID,
          params.clientMsgID,
          params.filter,
          params.offset,
          params.count
        );
      }),
  };
}

export interface MessageModuleApi {
  createTextMessage: (
    content: string,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createTextAtMessage: (
    params: AtMsgParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createLocationMessage: (
    params: LocationMsgParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createCustomMessage: (
    params: CustomMsgParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createQuoteMessage: (
    params: QuoteMsgParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createCardMessage: (
    params: CardElem,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createMergerMessage: (
    params: MergerMsgParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createFaceMessage: (
    params: FaceMessageParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createForwardMessage: (
    message: MessageItem,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createImageMessage: (
    imagePath: string,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createImageMessageFromFullPath: (
    imagePath: string,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createImageMessageByURL: (
    params: ImageMsgParamsByURL,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createVideoMessage: (
    params: VideoMsgByPathParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createVideoMessageFromFullPath: (
    params: VideoMsgByPathParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createVideoMessageByURL: (
    params: VideoMsgParamsByURL,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createSoundMessage: (
    params: SoundMsgByPathParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createSoundMessageFromFullPath: (
    params: SoundMsgByPathParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createSoundMessageByURL: (
    params: SoundMsgParamsByURL,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createFileMessage: (
    params: FileMsgByPathParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createFileMessageFromFullPath: (
    params: FileMsgByPathParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  createFileMessageByURL: (
    params: FileMsgParamsByURL,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  sendMessage: (
    params: SendMsgParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  sendMessageNotOss: (
    params: SendMsgParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  typingStatusUpdate: (
    params: TypingUpdateParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  revokeMessage: (
    params: AccessMessageParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  deleteMessage: (
    params: AccessMessageParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  deleteMessageFromLocalStorage: (
    params: AccessMessageParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  deleteAllMsgFromLocal: (opid?: string) => Promise<BaseResponse<void>>;
  deleteAllMsgFromLocalAndSvr: (opid?: string) => Promise<BaseResponse<void>>;
  searchLocalMessages: (
    params: SearchLocalParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem[]>>;
  getAdvancedHistoryMessageList: (
    params: GetAdvancedHistoryMsgParams,
    opid?: string
  ) => Promise<BaseResponse<AdvancedGetMessageResult>>;
  getAdvancedHistoryMessageListReverse: (
    params: GetAdvancedHistoryMsgParams,
    opid?: string
  ) => Promise<BaseResponse<AdvancedGetMessageResult>>;
  fetchSurroundingMessages: (
    params: FetchSurroundingParams,
    opid?: string
  ) => Promise<BaseResponse<{ messageList: MessageItem[] }>>;
  findMessageList: (
    params: FindMessageParams[],
    opid?: string
  ) => Promise<BaseResponse<MessageItem[]>>;
  insertGroupMessageToLocalStorage: (
    params: InsertGroupMsgParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  insertSingleMessageToLocalStorage: (
    params: InsertSingleMsgParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  setMessageLocalEx: (
    params: SetMessageLocalExParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  sendGroupMessageReadReceipt: (
    params: SendGroupReadReceiptParams,
    opid?: string
  ) => Promise<BaseResponse<void>>;
  getGroupMessageReaderList: (
    params: GetGroupMessageReaderParams,
    opid?: string
  ) => Promise<BaseResponse<string[]>>;
}
