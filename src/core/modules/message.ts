import { v4 as uuidV4 } from 'uuid';
import OpenIMSDK from '..';
import {
  AdvancedGetMessageResult,
  BaseResponse,
  CardElem,
  MessageItem,
} from '@/types/entity';
import {
  AtMsgParams,
  CustomMsgParams,
  FaceMessageParams,
  FileMsgByPathParams,
  FileMsgByUrlParams,
  GetAdvancedHistoryMsgParams,
  ImageMsgByUrlParams,
  LocationMsgParams,
  MergerMsgParams,
  QuoteMsgParams,
  SendMsgParams,
  SoundMsgByPathParams,
  SoundMsgByUrlParams,
  VideoMsgByPathParams,
  VideoMsgByUrlParams,
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

    createImageMessageByUrl: (params: ImageMsgByUrlParams, opid = uuidV4()) =>
      openIMSDK.asyncRetunWrap<MessageItem>(
        opid,
        openIMSDK.libOpenIMSDK.create_image_message_by_url(
          opid,
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

    createVideoMessageByUrl: (params: VideoMsgByUrlParams, opid = uuidV4()) =>
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

    createSoundMessageByUrl: (params: SoundMsgByUrlParams, opid = uuidV4()) =>
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

    createFileMessageByUrl: (params: FileMsgByUrlParams, opid = uuidV4()) =>
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
          openIMSDK.baseCallbackWrap<MessageItem>(resolve, reject),
          opid,
          JSON.stringify(params.message),
          params.recvID,
          params.groupID,
          JSON.stringify(offlinePushInfo)
        );
      }),

    // sendMessageNotOss: (params: SendMsgParams, opid = uuidV4()) =>
    //   new Promise<BaseResponse<MessageItem>>((resolve, reject) => {
    //     const offlinePushInfo = params.offlinePushInfo ?? {
    //       title: 'You has a new message.',
    //       desc: 'You has a new message.',
    //       ex: '',
    //       iOSPushSound: '+1',
    //       iOSBadgeCount: true,
    //     };
    //     openIMSDK.libOpenIMSDK.send_message_not_oss(
    //       openIMSDK.baseCallbackWrap<MessageItem>(resolve, reject),
    //       opid,
    //       JSON.stringify(params.message),
    //       params.recvID,
    //       params.groupID,
    //       JSON.stringify(offlinePushInfo)
    //     );
    //   }),

    // typingStatusUpdate: (params: TypingUpdateParams, opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.typing_status_update(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       params.recvID,
    //       params.msgTip
    //     );
    //   }),

    // revokeMessage: (params: OpreateMessageParams, opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.revoke_message(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       params.conversationID,
    //       params.clientMsgID
    //     );
    //   }),

    // deleteMessage: (params: OpreateMessageParams, opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.delete_message(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       params.conversationID,
    //       params.clientMsgID
    //     );
    //   }),

    // deleteMessageFromLocalStorage: (params: OpreateMessageParams, opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.delete_message_from_local_storage(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       params.conversationID,
    //       params.clientMsgID
    //     );
    //   }),

    // deleteAllMsgFromLocal: (opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.delete_all_msg_from_local(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //     );
    //   }),

    // deleteAllMsgFromLocalAndSvr: (opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.delete_all_msg_from_local_and_svr(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //     );
    //   }),

    // searchLocalMessages: (params: SearchLocalParams, opid = uuidV4()) =>
    //   new Promise<BaseResponse<MessageItem[]>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.search_local_messages(
    //       openIMSDK.baseCallbackWrap<MessageItem[]>(resolve, reject),
    //       opid,
    //       JSON.stringify(params)
    //     );
    //   }),

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

    // getAdvancedHistoryMessageListReverse: (
    //   params: GetAdvancedHistoryMsgParams, opid = uuidV4()
    // ) =>
    //   new Promise<BaseResponse<AdvancedGetMessageResult>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.get_advanced_history_message_list_reverse(
    //       openIMSDK.baseCallbackWrap<AdvancedGetMessageResult>(resolve, reject),
    //       opid,
    //       JSON.stringify(params)
    //     );
    //   }),
    // findMessageList: (params: FindMessageParams[], opid = uuidV4()) =>
    //   new Promise<BaseResponse<MessageItem[]>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.find_message_list(
    //       openIMSDK.baseCallbackWrap<MessageItem[]>(resolve, reject),
    //       opid,
    //       JSON.stringify(params)
    //     );
    //   }),
    // insertGroupMessageToLocalStorage: (params: InsertGroupMsgParams, opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.insert_group_message_to_local_storage(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       JSON.stringify(params.message),
    //       params.groupID,
    //       params.sendID
    //     );
    //   }),
    // insertSingleMessageToLocalStorage: (params: InsertSingleMsgParams, opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.insert_single_message_to_local_storage(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       JSON.stringify(params.message),
    //       params.recvID,
    //       params.sendID
    //     );
    //   }),
    // setMessageLocalEx: (params: SetMessageLocalExParams, opid = uuidV4()) =>
    //   new Promise<BaseResponse<void>>((resolve, reject) => {
    //     openIMSDK.libOpenIMSDK.set_message_local_ex(
    //       openIMSDK.baseCallbackWrap<void>(resolve, reject),
    //       opid,
    //       params.conversationID,
    //       params.clientMsgID,
    //       params.localEx
    //     );
    //   }),
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
  createImageMessageByUrl: (
    params: ImageMsgByUrlParams,
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
  createVideoMessageByUrl: (
    params: VideoMsgByUrlParams,
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
  createSoundMessageByUrl: (
    params: SoundMsgByUrlParams,
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
  createFileMessageByUrl: (
    params: FileMsgByUrlParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
  getAdvancedHistoryMessageList: (
    params: GetAdvancedHistoryMsgParams,
    opid?: string
  ) => Promise<BaseResponse<AdvancedGetMessageResult>>;
  sendMessage: (
    params: SendMsgParams,
    opid?: string
  ) => Promise<BaseResponse<MessageItem>>;
}
