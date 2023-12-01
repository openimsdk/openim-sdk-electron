import ffi from 'ffi-napi';
import { v4 as uuidV4 } from 'uuid';
import type { LibOpenIMSDK } from 'libOpenIMSDK';
import { UserModuleApi, setupUserModule } from './modules/user';
import { InitConfig, LoginParams } from '@/types/params';
import { BaseResponse, SelfUserInfo } from '@/types/entity';
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

const CB_I_S = ffi.Function('void', ['int', 'string']);
const CB_S_I_S_S = ffi.Function('void', ['string', 'int', 'string', 'string']);
const CB_S_I_S_S_I = ffi.Function('void', [
  'string',
  'int',
  'string',
  'string',
  'int',
]);

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

  constructor(libPath: string) {
    super();
    this.libOpenIMSDK = ffi.Library(libPath, {
      set_group_listener: ['void', [CB_I_S]],
      set_conversation_listener: ['void', [CB_I_S]],
      set_advanced_msg_listener: ['void', [CB_I_S]],
      set_batch_msg_listener: ['void', [CB_I_S]],
      set_user_listener: ['void', [CB_I_S]],
      set_friend_listener: ['void', [CB_I_S]],
      set_custom_business_listener: ['void', [CB_I_S]],
      init_sdk: ['uint8', [CB_I_S, 'string', 'string']],
      un_init_sdk: ['void', ['string']],
      login: ['void', [CB_S_I_S_S, 'string', 'string', 'string']],
      logout: ['void', [CB_S_I_S_S, 'string']],
      network_status_changed: ['void', [CB_S_I_S_S, 'string']],
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
        ['string', 'string', 'string', 'string'],
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
      get_all_conversation_list: ['void', [CB_S_I_S_S, 'string']],
      get_advanced_history_message_list: [
        'void',
        [CB_S_I_S_S, 'string', 'string'],
      ],
      send_message: [
        'void',
        [CB_S_I_S_S_I, 'string', 'string', 'string', 'string', 'string'],
      ],

      // User related functions
      get_users_info: ['void', [CB_S_I_S_S, 'string', 'string']],
      get_users_info_from_srv: ['void', [CB_S_I_S_S, 'string', 'string']],
      set_self_info: ['void', [CB_S_I_S_S, 'string', 'string']],
      get_self_user_info: ['void', [CB_S_I_S_S, 'string']],
      update_msg_sender_info: [
        'void',
        [CB_S_I_S_S, 'string', 'string', 'string'],
      ],
      subscribe_users_status: ['void', [CB_S_I_S_S, 'string', 'string']],
      unsubscribe_users_status: ['void', [CB_S_I_S_S, 'string', 'string']],
      get_subscribe_users_status: ['void', [CB_S_I_S_S, 'string']],
      get_user_status: ['void', [CB_S_I_S_S, 'string', 'string']],

      // Friend related functions
      get_specified_friends_info: ['void', [CB_S_I_S_S, 'string', 'string']],
      get_friend_list: ['void', [CB_S_I_S_S, 'string']],
      get_friend_list_page: ['void', [CB_S_I_S_S, 'string', 'int', 'int']],
      search_friends: ['void', [CB_S_I_S_S, 'string', 'string']],
      check_friend: ['void', [CB_S_I_S_S, 'string', 'string']],
      add_friend: ['void', [CB_S_I_S_S, 'string', 'string']],
      set_friend_remark: ['void', [CB_S_I_S_S, 'string', 'string']],
      delete_friend: ['void', [CB_S_I_S_S, 'string', 'string']],
      get_friend_application_list_as_recipient: [
        'void',
        [CB_S_I_S_S, 'string'],
      ],
      get_friend_application_list_as_applicant: [
        'void',
        [CB_S_I_S_S, 'string'],
      ],
      accept_friend_application: ['void', [CB_S_I_S_S, 'string', 'string']],
      refuse_friend_application: ['void', [CB_S_I_S_S, 'string', 'string']],
      add_black: ['void', [CB_S_I_S_S, 'string', 'string']],
      get_black_list: ['void', [CB_S_I_S_S, 'string']],
      remove_black: ['void', [CB_S_I_S_S, 'string', 'string']],

      // Group related functions
      create_group: ['void', [CB_S_I_S_S, 'string', 'string']],
      join_group: ['void', [CB_S_I_S_S, 'string', 'string', 'string', 'int']],
      quit_group: ['void', [CB_S_I_S_S, 'string', 'string']],
      dismiss_group: ['void', [CB_S_I_S_S, 'string', 'string']],
      change_group_mute: ['void', [CB_S_I_S_S, 'string', 'string', 'int']],
      change_group_member_mute: [
        'void',
        [CB_S_I_S_S, 'string', 'string', 'string', 'int'],
      ],
      set_group_member_role_level: [
        'void',
        [CB_S_I_S_S, 'string', 'string', 'string', 'int'],
      ],
      set_group_member_info: ['void', [CB_S_I_S_S, 'string', 'string']],
      get_joined_group_list: ['void', [CB_S_I_S_S, 'string']],
      get_specified_groups_info: ['void', [CB_S_I_S_S, 'string', 'string']],
      search_groups: ['void', [CB_S_I_S_S, 'string', 'string']],
      set_group_info: ['void', [CB_S_I_S_S, 'string', 'string']],
      set_group_verification: ['void', [CB_S_I_S_S, 'string', 'string', 'int']],
      set_group_look_member_info: [
        'void',
        [CB_S_I_S_S, 'string', 'string', 'int'],
      ],
      set_group_apply_member_friend: [
        'void',
        [CB_S_I_S_S, 'string', 'string', 'int'],
      ],
      get_group_member_list: [
        'void',
        [CB_S_I_S_S, 'string', 'string', 'int', 'int', 'int'],
      ],
      get_group_member_owner_and_admin: [
        'void',
        [CB_S_I_S_S, 'string', 'string'],
      ],
      get_group_member_list_by_join_time_filter: [
        'void',
        [
          CB_S_I_S_S,
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
        [CB_S_I_S_S, 'string', 'string', 'string'],
      ],
      kick_group_member: [
        'void',
        [CB_S_I_S_S, 'string', 'string', 'string', 'string'],
      ],
      transfer_group_owner: [
        'void',
        [CB_S_I_S_S, 'string', 'string', 'string'],
      ],
      invite_user_to_group: [
        'void',
        [CB_S_I_S_S, 'string', 'string', 'string', 'string'],
      ],
      get_group_application_list_as_recipient: ['void', [CB_S_I_S_S, 'string']],
      get_group_application_list_as_applicant: ['void', [CB_S_I_S_S, 'string']],
      accept_group_application: [
        'void',
        [CB_S_I_S_S, 'string', 'string', 'string', 'string'],
      ],
      refuse_group_application: [
        'void',
        [CB_S_I_S_S, 'string', 'string', 'string', 'string'],
      ],
      set_group_member_nickname: [
        'void',
        [CB_S_I_S_S, 'string', 'string', 'string', 'string'],
      ],
      search_group_members: ['void', [CB_S_I_S_S, 'string', 'string']],
      is_join_group: ['void', [CB_S_I_S_S, 'string', 'string']],
    }) as LibOpenIMSDK;

    this.listenerCallback = ffi.Callback(
      'void',
      ['int', 'string'],
      (event: NativeEvent, data) => {
        const cbEvent = eventMapping[event];
        this.emit(cbEvent, data);
        console.log(`listener callback - Event: ${cbEvent}, Data: ${data}`);
      }
    );

    Object.assign(this, setupUserModule(this));
    Object.assign(this, setupFriendModule(this));
    Object.assign(this, setupGroupModule(this));
    Object.assign(this, setupConversationModule(this));
    Object.assign(this, setupMessageModule(this));
  }

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

  // implements user api
  getSelfUserInfo!: UserModuleApi['getSelfUserInfo'];

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
  sendMessage!: MessageModuleApi['sendMessage'];
}

export default OpenIMSDK;
