import ffi from '@openim/ffi-napi';
import { v4 as uuidV4 } from 'uuid';
import type { LibOpenIMSDK } from 'libOpenIMSDK';
import { UserModuleApi, setupUserModule } from './modules/user';
import { InitConfig, LoginParams } from '@/types/params';
import { BaseResponse, SelfUserInfo, EmitProxy } from '@/types/entity';
import { ErrorCode } from '@/constant/api';
import { LoginStatus } from '@/types/enum';
import { NativeEvent, eventMapping } from '@/constant/callback';
import Emitter from '@/utils/emitter';
import { type FriendModuleApi, setupFriendModule } from './modules/friend';
import { type GroupModuleApi, setupGroupModule } from './modules/group';
import {
  type ConversationModuleApi,
  setupConversationModule,
} from './modules/conversation';
import { type MessageModuleApi, setupMessageModule } from './modules/message';

function isObject(value: unknown) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

class OpenIMSDK
  extends Emitter
  implements
    UserModuleApi,
    FriendModuleApi,
    GroupModuleApi,
    ConversationModuleApi,
    MessageModuleApi
{
  libOpenIMSDK: LibOpenIMSDK;
  listenerCallback: Buffer;

  constructor(libPath: string, emitProxy?: EmitProxy) {
    super();
    this.libOpenIMSDK = ffi.Library(libPath, {
      set_group_listener: ['void', ['pointer']],
      set_conversation_listener: ['void', ['pointer']],
      set_advanced_msg_listener: ['void', ['pointer']],
      set_batch_msg_listener: ['void', ['pointer']],
      set_user_listener: ['void', ['pointer']],
      set_friend_listener: ['void', ['pointer']],
      set_custom_business_listener: ['void', ['pointer']],
      init_sdk: ['uint8', ['pointer', 'string', 'string']],
      un_init_sdk: ['void', ['string']],
      login: ['void', ['pointer', 'string', 'string', 'string']],
      logout: ['void', ['pointer', 'string']],
      set_app_background_status: ['void', ['pointer', 'string', 'int']],
      network_status_changed: ['void', ['pointer', 'string']],
      get_login_status: ['int', ['string']],
      get_login_user: ['string', []],
      create_text_message: ['string', ['string', 'string']],
      create_advanced_text_message: ['string', ['string', 'string', 'string']],
      create_text_at_message: [
        'string',
        ['string', 'string', 'string', 'string', 'string'],
      ],
      create_location_message: [
        'string',
        ['string', 'string', 'double', 'double'],
      ],
      create_custom_message: [
        'string',
        ['string', 'string', 'string', 'string'],
      ],
      create_quote_message: ['string', ['string', 'string', 'string']],
      create_advanced_quote_message: [
        'string',
        ['string', 'string', 'string', 'string'],
      ],
      create_card_message: ['string', ['string', 'string']],
      create_video_message_from_full_path: [
        'string',
        ['string', 'string', 'string', 'long long', 'string'],
      ],
      create_image_message_from_full_path: ['string', ['string', 'string']],
      create_sound_message_from_full_path: [
        'string',
        ['string', 'string', 'long long'],
      ],
      create_file_message_from_full_path: [
        'string',
        ['string', 'string', 'string'],
      ],
      create_image_message: ['string', ['string', 'string']],
      create_image_message_by_url: [
        'string',
        ['string', 'string', 'string', 'string', 'string'],
      ],
      create_sound_message_by_url: ['string', ['string', 'string']],
      create_sound_message: ['string', ['string', 'string', 'long long']],
      create_video_message_by_url: ['string', ['string', 'string']],
      create_video_message: [
        'string',
        ['string', 'string', 'string', 'long long', 'string'],
      ],
      create_file_message_by_url: ['string', ['string', 'string']],
      create_file_message: ['string', ['string', 'string', 'string']],
      create_merger_message: [
        'string',
        ['string', 'string', 'string', 'string'],
      ],
      create_face_message: ['string', ['string', 'int', 'string']],
      create_forward_message: ['string', ['string', 'string']],
      get_all_conversation_list: ['void', ['pointer', 'string']],
      get_conversation_list_split: [
        'void',
        ['pointer', 'string', 'int', 'int'],
      ],
      get_one_conversation: ['void', ['pointer', 'string', 'int', 'string']],
      get_multiple_conversation: ['void', ['pointer', 'string', 'string']],
      set_conversation_msg_destruct_time: [
        'void',
        ['pointer', 'string', 'string', 'long long'],
      ],
      set_conversation_is_msg_destruct: [
        'void',
        ['pointer', 'string', 'string', 'int'],
      ],
      hide_conversation: ['void', ['pointer', 'string', 'string']],
      get_conversation_recv_message_opt: [
        'void',
        ['pointer', 'string', 'string'],
      ],
      set_conversation_draft: [
        'void',
        ['pointer', 'string', 'string', 'string'],
      ],
      reset_conversation_group_at_type: [
        'void',
        ['pointer', 'string', 'string'],
      ],
      pin_conversation: ['void', ['pointer', 'string', 'string', 'int']],
      set_conversation_private_chat: [
        'void',
        ['pointer', 'string', 'string', 'int'],
      ],
      set_conversation_burn_duration: [
        'void',
        ['pointer', 'string', 'string', 'int'],
      ],
      set_conversation_recv_message_opt: [
        'void',
        ['pointer', 'string', 'string', 'int'],
      ],
      get_total_unread_msg_count: ['void', ['pointer', 'string']],
      get_at_all_tag: ['string', ['string']],
      get_conversation_id_by_session_type: [
        'string',
        ['string', 'string', 'int'],
      ],
      send_message: [
        'void',
        ['pointer', 'string', 'string', 'string', 'string', 'string'],
      ],
      send_message_not_oss: [
        'void',
        ['pointer', 'string', 'string', 'string', 'string', 'string'],
      ],
      find_message_list: ['void', ['pointer', 'string', 'string']],
      get_advanced_history_message_list: [
        'void',
        ['pointer', 'string', 'string'],
      ],
      get_advanced_history_message_list_reverse: [
        'void',
        ['pointer', 'string', 'string'],
      ],
      revoke_message: ['void', ['pointer', 'string', 'string', 'string']],
      typing_status_update: ['void', ['pointer', 'string', 'string', 'string']],
      mark_conversation_message_as_read: [
        'void',
        ['pointer', 'string', 'string'],
      ],
      delete_message_from_local_storage: [
        'void',
        ['pointer', 'string', 'string', 'string'],
      ],
      delete_message: ['void', ['pointer', 'string', 'string', 'string']],
      hide_all_conversations: ['void', ['pointer', 'string']],
      delete_all_msg_from_local_and_svr: ['void', ['pointer', 'string']],
      delete_all_msg_from_local: ['void', ['pointer', 'string']],
      clear_conversation_and_delete_all_msg: [
        'void',
        ['pointer', 'string', 'string'],
      ],
      delete_conversation_and_delete_all_msg: [
        'void',
        ['pointer', 'string', 'string'],
      ],
      insert_single_message_to_local_storage: [
        'void',
        ['pointer', 'string', 'string', 'string', 'string'],
      ],
      insert_group_message_to_local_storage: [
        'void',
        ['pointer', 'string', 'string', 'string', 'string'],
      ],
      search_local_messages: ['void', ['pointer', 'string', 'string']],
      set_message_local_ex: [
        'void',
        ['pointer', 'string', 'string', 'string', 'string'],
      ],
      get_users_info: ['void', ['pointer', 'string', 'string']],
      get_users_info_with_cache: [
        'void',
        ['pointer', 'string', 'string', 'string'],
      ],
      get_users_info_from_srv: ['void', ['pointer', 'string', 'string']],
      set_self_info: ['void', ['pointer', 'string', 'string']],
      set_global_recv_message_opt: ['void', ['pointer', 'string', 'int']],
      get_self_user_info: ['void', ['pointer', 'string']],
      update_msg_sender_info: [
        'void',
        ['pointer', 'string', 'string', 'string'],
      ],
      subscribe_users_status: ['void', ['pointer', 'string', 'string']],
      unsubscribe_users_status: ['void', ['pointer', 'string', 'string']],
      get_subscribe_users_status: ['void', ['pointer', 'string']],
      get_user_status: ['void', ['pointer', 'string', 'string']],
      // Friend functions
      get_specified_friends_info: ['void', ['pointer', 'string', 'string']],
      get_friend_list: ['void', ['pointer', 'string']],
      get_friend_list_page: ['void', ['pointer', 'string', 'int', 'int']],
      search_friends: ['void', ['pointer', 'string', 'string']],
      check_friend: ['void', ['pointer', 'string', 'string']],
      add_friend: ['void', ['pointer', 'string', 'string']],
      set_friend_remark: ['void', ['pointer', 'string', 'string']],
      delete_friend: ['void', ['pointer', 'string', 'string']],
      get_friend_application_list_as_recipient: ['void', ['pointer', 'string']],
      get_friend_application_list_as_applicant: ['void', ['pointer', 'string']],
      accept_friend_application: ['void', ['pointer', 'string', 'string']],
      refuse_friend_application: ['void', ['pointer', 'string', 'string']],
      add_black: ['void', ['pointer', 'string', 'string']],
      get_black_list: ['void', ['pointer', 'string']],
      remove_black: ['void', ['pointer', 'string', 'string']],
      // Group functions
      create_group: ['void', ['pointer', 'string', 'string']],
      join_group: ['void', ['pointer', 'string', 'string', 'string', 'int']],
      quit_group: ['void', ['pointer', 'string', 'string']],
      dismiss_group: ['void', ['pointer', 'string', 'string']],
      change_group_mute: ['void', ['pointer', 'string', 'string', 'int']],
      change_group_member_mute: [
        'void',
        ['pointer', 'string', 'string', 'string', 'int'],
      ],
      set_group_member_role_level: [
        'void',
        ['pointer', 'string', 'string', 'string', 'int'],
      ],
      set_group_member_info: ['void', ['pointer', 'string', 'string']],
      get_joined_group_list: ['void', ['pointer', 'string']],
      get_specified_groups_info: ['void', ['pointer', 'string', 'string']],
      search_groups: ['void', ['pointer', 'string', 'string']],
      set_group_info: ['void', ['pointer', 'string', 'string']],
      set_group_verification: ['void', ['pointer', 'string', 'string', 'int']],
      set_group_look_member_info: [
        'void',
        ['pointer', 'string', 'string', 'int'],
      ],
      set_group_apply_member_friend: [
        'void',
        ['pointer', 'string', 'string', 'int'],
      ],
      get_group_member_list: [
        'void',
        ['pointer', 'string', 'string', 'int', 'int', 'int'],
      ],
      get_group_member_owner_and_admin: [
        'void',
        ['pointer', 'string', 'string'],
      ],
      get_group_member_list_by_join_time_filter: [
        'void',
        [
          'pointer',
          'string',
          'string',
          'int',
          'int',
          'long long',
          'long long',
          'string',
        ],
      ],
      get_specified_group_members_info: [
        'void',
        ['pointer', 'string', 'string', 'string'],
      ],
      kick_group_member: [
        'void',
        ['pointer', 'string', 'string', 'string', 'string'],
      ],
      transfer_group_owner: ['void', ['pointer', 'string', 'string', 'string']],
      invite_user_to_group: [
        'void',
        ['pointer', 'string', 'string', 'string', 'string'],
      ],
      get_group_application_list_as_recipient: ['void', ['pointer', 'string']],
      get_group_application_list_as_applicant: ['void', ['pointer', 'string']],
      accept_group_application: [
        'void',
        ['pointer', 'string', 'string', 'string', 'string'],
      ],
      refuse_group_application: [
        'void',
        ['pointer', 'string', 'string', 'string', 'string'],
      ],
      set_group_member_nickname: [
        'void',
        ['pointer', 'string', 'string', 'string', 'string'],
      ],
      search_group_members: ['void', ['pointer', 'string', 'string']],
      is_join_group: ['void', ['pointer', 'string', 'string']],
    }) as LibOpenIMSDK;

    // eslint-disable-next-line
    const emitFn = emitProxy ?? this.emit;
    this.listenerCallback = ffi.Callback(
      'void',
      ['int', 'string'],
      (event: NativeEvent, data) => {
        const cbEvent = eventMapping[event];
        emitFn(cbEvent, this.generateEventResponse(data));
        console.log(`listener callback - Event: ${cbEvent}, Data: ${data}`);
      }
    );

    Object.assign(this, setupUserModule(this));
    Object.assign(this, setupFriendModule(this));
    Object.assign(this, setupGroupModule(this));
    Object.assign(this, setupConversationModule(this));
    Object.assign(this, setupMessageModule(this));
  }

  generateEventResponse = (data: unknown): BaseResponse => {
    let errCode = 0;
    let errMsg = '';
    try {
      data = JSON.parse(data as string);
    } catch (error) {
      // do nothing
    }
    // @ts-ignore
    if (isObject(data) && data.errCode !== undefined) {
      // @ts-ignore
      errCode = data.errCode;
      // @ts-ignore
      errMsg = data.errMsg;
      // @ts-ignore
      data = data.data;
    }
    return {
      errCode,
      errMsg,
      data,
      operationID: '',
    };
  };

  baseCallbackWrap = <T>(
    resolve: (response: BaseResponse<T>) => void,
    reject: (response: BaseResponse<T>) => void
  ) =>
    ffi.Callback(
      'void',
      ['string', 'int', 'string', 'string'],
      (operationID, errCode: number, errMsg, data) => {
        let realData;
        try {
          realData = JSON.parse(data);
        } catch (error) {
          realData = data;
        }
        const response: BaseResponse<T> = {
          errCode,
          errMsg,
          data: realData,
          operationID,
        };
        if (errCode === 0) {
          resolve(response);
        } else {
          reject(response);
        }
      }
    );

  asyncRetunWrap = <T>(operationID: string, data: unknown) =>
    new Promise<BaseResponse<T>>((resolve, reject) => {
      const hasError = !data && !operationID.includes('unInitSDK');
      if (data && typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (error) {
          // do nothing
        }
      }
      const response = {
        errCode: hasError ? ErrorCode.UnknownError : 0,
        errMsg: '',
        data: data as T,
        operationID,
      };
      if (response.errCode === 0) {
        resolve(response);
      } else {
        reject(response);
      }
    });

  setListener = () => {
    this.libOpenIMSDK.set_user_listener(this.listenerCallback);
    this.libOpenIMSDK.set_friend_listener(this.listenerCallback);
    this.libOpenIMSDK.set_group_listener(this.listenerCallback);
    this.libOpenIMSDK.set_conversation_listener(this.listenerCallback);
    this.libOpenIMSDK.set_advanced_msg_listener(this.listenerCallback);
    this.libOpenIMSDK.set_batch_msg_listener(this.listenerCallback);
    this.libOpenIMSDK.set_custom_business_listener(this.listenerCallback);
  };

  initSDK = (param: InitConfig, opid = uuidV4()) =>
    new Promise<boolean>((resolve, reject) => {
      const flag = this.libOpenIMSDK.init_sdk(
        this.listenerCallback,
        opid,
        JSON.stringify(param)
      );
      if (!flag) {
        reject(!!flag);
        return;
      }
      this.setListener();
      resolve(!!flag);
    });

  login = (param: LoginParams, opid = uuidV4()) =>
    new Promise<BaseResponse>((resolve, reject) => {
      const loginCallback = this.baseCallbackWrap(resolve, reject);
      this.libOpenIMSDK.login(loginCallback, opid, param.userID, param.token);
    });

  getLoginStatus = (opid = uuidV4()) =>
    this.asyncRetunWrap<LoginStatus>(
      opid,
      this.libOpenIMSDK.get_login_status(opid)
    );

  getLoginUser = (opid = uuidV4()) =>
    this.asyncRetunWrap<SelfUserInfo>(opid, this.libOpenIMSDK.get_login_user());

  logout = (opid = uuidV4()) =>
    new Promise<BaseResponse>((resolve, reject) => {
      const logoutCallback = this.baseCallbackWrap(resolve, reject);
      this.libOpenIMSDK.logout(logoutCallback, opid);
    });

  unInitSDK = (opid = uuidV4()) =>
    this.asyncRetunWrap(
      opid,
      this.libOpenIMSDK.un_init_sdk(`unInitSDK-${opid}`)
    );

  setAppBackgroundStatus = (isInBackground: boolean, opid = uuidV4()) =>
    new Promise<BaseResponse<void>>((resolve, reject) => {
      this.libOpenIMSDK.set_app_background_status(
        this.baseCallbackWrap<void>(resolve, reject),
        opid,
        isInBackground ? 1 : 0
      );
    });

  networkStatusChanged = (opid = uuidV4()) =>
    new Promise<BaseResponse<void>>((resolve, reject) => {
      this.libOpenIMSDK.network_status_changed(
        this.baseCallbackWrap<void>(resolve, reject),
        opid
      );
    });

  // implements user api
  getSelfUserInfo!: UserModuleApi['getSelfUserInfo'];
  setSelfInfo!: UserModuleApi['setSelfInfo'];
  getUsersInfoWithCache!: UserModuleApi['getUsersInfoWithCache'];
  subscribeUsersStatus!: UserModuleApi['subscribeUsersStatus'];
  unsubscribeUsersStatus!: UserModuleApi['unsubscribeUsersStatus'];
  getSubscribeUsersStatus!: UserModuleApi['getSubscribeUsersStatus'];
  setGlobalRecvMessageOpt!: UserModuleApi['setGlobalRecvMessageOpt'];

  // implements friend api
  acceptFriendApplication!: FriendModuleApi['acceptFriendApplication'];
  addBlack!: FriendModuleApi['addBlack'];
  addFriend!: FriendModuleApi['addFriend'];
  checkFriend!: FriendModuleApi['checkFriend'];
  deleteFriend!: FriendModuleApi['deleteFriend'];
  getBlackList!: FriendModuleApi['getBlackList'];
  getFriendApplicationListAsApplicant!: FriendModuleApi['getFriendApplicationListAsApplicant'];
  getFriendApplicationListAsRecipient!: FriendModuleApi['getFriendApplicationListAsRecipient'];
  getFriendList!: FriendModuleApi['getFriendList'];
  getSpecifiedFriendsInfo!: FriendModuleApi['getSpecifiedFriendsInfo'];
  refuseFriendApplication!: FriendModuleApi['refuseFriendApplication'];
  removeBlack!: FriendModuleApi['removeBlack'];
  searchFriends!: FriendModuleApi['searchFriends'];
  setFriendRemark!: FriendModuleApi['setFriendRemark'];

  // implements group api
  createGroup!: GroupModuleApi['createGroup'];
  joinGroup!: GroupModuleApi['joinGroup'];
  inviteUserToGroup!: GroupModuleApi['inviteUserToGroup'];
  getJoinedGroupList!: GroupModuleApi['getJoinedGroupList'];
  searchGroups!: GroupModuleApi['searchGroups'];
  getSpecifiedGroupsInfo!: GroupModuleApi['getSpecifiedGroupsInfo'];
  setGroupInfo!: GroupModuleApi['setGroupInfo'];
  getGroupApplicationListAsRecipient!: GroupModuleApi['getGroupApplicationListAsRecipient'];
  getGroupApplicationListAsApplicant!: GroupModuleApi['getGroupApplicationListAsApplicant'];
  acceptGroupApplication!: GroupModuleApi['acceptGroupApplication'];
  refuseGroupApplication!: GroupModuleApi['refuseGroupApplication'];
  getGroupMemberList!: GroupModuleApi['getGroupMemberList'];
  getSpecifiedGroupMembersInfo!: GroupModuleApi['getSpecifiedGroupMembersInfo'];
  searchGroupMembers!: GroupModuleApi['searchGroupMembers'];
  setGroupMemberInfo!: GroupModuleApi['setGroupMemberInfo'];
  getGroupMemberOwnerAndAdmin!: GroupModuleApi['getGroupMemberOwnerAndAdmin'];
  getGroupMemberListByJoinTimeFilter!: GroupModuleApi['getGroupMemberListByJoinTimeFilter'];
  kickGroupMember!: GroupModuleApi['kickGroupMember'];
  changeGroupMemberMute!: GroupModuleApi['changeGroupMemberMute'];
  changeGroupMute!: GroupModuleApi['changeGroupMute'];
  transferGroupOwner!: GroupModuleApi['transferGroupOwner'];
  dismissGroup!: GroupModuleApi['dismissGroup'];
  quitGroup!: GroupModuleApi['quitGroup'];

  // implements conversation api
  getAllConversationList!: ConversationModuleApi['getAllConversationList'];
  getConversationListSplit!: ConversationModuleApi['getConversationListSplit'];
  getOneConversation!: ConversationModuleApi['getOneConversation'];
  getMultipleConversation!: ConversationModuleApi['getMultipleConversation'];
  getConversationIDBySessionType!: ConversationModuleApi['getConversationIDBySessionType'];
  getTotalUnreadMsgCount!: ConversationModuleApi['getTotalUnreadMsgCount'];
  markConversationMessageAsRead!: ConversationModuleApi['markConversationMessageAsRead'];
  setConversationDraft!: ConversationModuleApi['setConversationDraft'];
  pinConversation!: ConversationModuleApi['pinConversation'];
  setConversationRecvMessageOpt!: ConversationModuleApi['setConversationRecvMessageOpt'];
  setConversationPrivateChat!: ConversationModuleApi['setConversationPrivateChat'];
  setConversationBurnDuration!: ConversationModuleApi['setConversationBurnDuration'];
  resetConversationGroupAtType!: ConversationModuleApi['resetConversationGroupAtType'];
  hideConversation!: ConversationModuleApi['hideConversation'];
  hideAllConversation!: ConversationModuleApi['hideAllConversation'];
  clearConversationAndDeleteAllMsg!: ConversationModuleApi['clearConversationAndDeleteAllMsg'];
  deleteConversationAndDeleteAllMsg!: ConversationModuleApi['deleteConversationAndDeleteAllMsg'];

  // implements message api
  createTextMessage!: MessageModuleApi['createTextMessage'];
  createTextAtMessage!: MessageModuleApi['createTextAtMessage'];
  createLocationMessage!: MessageModuleApi['createLocationMessage'];
  createCustomMessage!: MessageModuleApi['createCustomMessage'];
  createQuoteMessage!: MessageModuleApi['createQuoteMessage'];
  createCardMessage!: MessageModuleApi['createCardMessage'];
  createMergerMessage!: MessageModuleApi['createMergerMessage'];
  createFaceMessage!: MessageModuleApi['createFaceMessage'];
  createForwardMessage!: MessageModuleApi['createForwardMessage'];
  createImageMessage!: MessageModuleApi['createImageMessage'];
  createImageMessageFromFullPath!: MessageModuleApi['createImageMessageFromFullPath'];
  createImageMessageByUrl!: MessageModuleApi['createImageMessageByUrl'];
  createVideoMessage!: MessageModuleApi['createVideoMessage'];
  createVideoMessageFromFullPath!: MessageModuleApi['createVideoMessageFromFullPath'];
  createVideoMessageByUrl!: MessageModuleApi['createVideoMessageByUrl'];
  createSoundMessage!: MessageModuleApi['createSoundMessage'];
  createSoundMessageFromFullPath!: MessageModuleApi['createSoundMessageFromFullPath'];
  createSoundMessageByUrl!: MessageModuleApi['createSoundMessageByUrl'];
  createFileMessage!: MessageModuleApi['createFileMessage'];
  createFileMessageFromFullPath!: MessageModuleApi['createFileMessageFromFullPath'];
  createFileMessageByUrl!: MessageModuleApi['createFileMessageByUrl'];
  getAdvancedHistoryMessageList!: MessageModuleApi['getAdvancedHistoryMessageList'];
  getAdvancedHistoryMessageListReverse!: MessageModuleApi['getAdvancedHistoryMessageListReverse'];
  sendMessage!: MessageModuleApi['sendMessage'];
  sendMessageNotOss!: MessageModuleApi['sendMessageNotOss'];
  findMessageList!: MessageModuleApi['findMessageList'];
  revokeMessage!: MessageModuleApi['revokeMessage'];
  typingStatusUpdate!: MessageModuleApi['typingStatusUpdate'];
  deleteMessageFromLocalStorage!: MessageModuleApi['deleteMessageFromLocalStorage'];
  deleteMessage!: MessageModuleApi['deleteMessage'];
  deleteAllMsgFromLocalAndSvr!: MessageModuleApi['deleteAllMsgFromLocalAndSvr'];
  deleteAllMsgFromLocal!: MessageModuleApi['deleteAllMsgFromLocal'];
  searchLocalMessages!: MessageModuleApi['searchLocalMessages'];
  insertGroupMessageToLocalStorage!: MessageModuleApi['insertGroupMessageToLocalStorage'];
  insertSingleMessageToLocalStorage!: MessageModuleApi['insertSingleMessageToLocalStorage'];
  setMessageLocalEx!: MessageModuleApi['setMessageLocalEx'];
}

export default OpenIMSDK;
