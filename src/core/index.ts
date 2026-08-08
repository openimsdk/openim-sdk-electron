import koffi from 'koffi';
import { uuidV4 } from '@/utils/uuid';
import type { NativeOpenIMSdk } from '@/types/nativeSdk';
import { UserModuleApi, setupUserModule } from './modules/user';
import {
  InitConfig,
  LogErrorParams,
  LogMessageParams,
  NativeLoginParams,
  UploadLogsParams,
} from '@/types/params';
import { SdkResponse, SdkEventEmitter } from '@/types/entity';
import { ErrorCode } from '@/constant/api';
import { NativeEvent, eventMapping } from '@/constant/callback';
import Emitter from '@/utils/emitter';
import { setupFriendModule } from './modules/friend';
import type { FriendModuleApi } from './modules/friend';
import { setupGroupModule } from './modules/group';
import type { GroupModuleApi } from './modules/group';
import { setupConversationModule } from './modules/conversation';
import type { ConversationModuleApi } from './modules/conversation';
import { setupMessageModule } from './modules/message';
import type { MessageModuleApi } from './modules/message';
import {
  SdkEvent,
  LoginStatus,
  LogLevel,
  UploadFileParams,
} from '@openim/wasm-client-sdk';

const EXPECTED_NATIVE_SDK_VERSION = 'v3.8.3-patch.15';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

const forceGetDataEvents = [
  SdkEvent.OnSyncServerStart,
  SdkEvent.OnSyncServerFinish,
  SdkEvent.OnSyncServerFailed,
  SdkEvent.OnSyncServerProgress,
];

type CallbackPrototypes = {
  base: koffi.IKoffiCType;
  sendMessage: koffi.IKoffiCType;
  listener: koffi.IKoffiCType;
};

let callbackPrototypes: CallbackPrototypes | undefined;

const getCallbackPrototypes = (): CallbackPrototypes => {
  if (!callbackPrototypes) {
    callbackPrototypes = {
      base: koffi.proto('__stdcall', 'baseCallback', 'void', [
        'str',
        'int',
        'str',
        'str',
      ]),
      sendMessage: koffi.proto('__stdcall', 'sendMessageCallback', 'void', [
        'str',
        'int',
        'str',
        'str',
        'int',
      ]),
      listener: koffi.proto('__stdcall', 'listenerCallback', 'void', [
        'int',
        'str',
      ]),
    };
  }

  return callbackPrototypes;
};

class OpenIMSdk
  extends Emitter
  implements
    UserModuleApi,
    FriendModuleApi,
    GroupModuleApi,
    ConversationModuleApi,
    MessageModuleApi
{
  nativeSdk = {} as NativeOpenIMSdk;
  baseCallbackProto: koffi.IKoffiCType;
  sendMessageCallbackProto: koffi.IKoffiCType;
  listenerCallback: koffi.IKoffiRegisteredCallback;
  lib: koffi.IKoffiLib;
  nativeSdkVersion: string;

  constructor(libPath: string, emitProxy?: SdkEventEmitter) {
    super();
    this.lib = koffi.load(libPath);
    try {
      this.nativeSdk.get_sdk_version = this.lib.func(
        '__stdcall',
        'get_sdk_version',
        'str',
        []
      );
      this.nativeSdkVersion = this.nativeSdk.get_sdk_version();
    } catch (error) {
      throw new Error(
        `The native OpenIM library does not expose get_sdk_version and is not compatible with Electron SDK ${EXPECTED_NATIVE_SDK_VERSION}: ${String(
          error
        )}`
      );
    }
    if (this.nativeSdkVersion !== EXPECTED_NATIVE_SDK_VERSION) {
      throw new Error(
        `Incompatible native OpenIM SDK version ${this.nativeSdkVersion}; expected ${EXPECTED_NATIVE_SDK_VERSION}`
      );
    }
    const callbackTypes = getCallbackPrototypes();
    this.baseCallbackProto = callbackTypes.base;
    this.sendMessageCallbackProto = callbackTypes.sendMessage;
    this.listenerCallback = koffi.register(
      (event: NativeEvent, data: string) => {
        const cbEvent = eventMapping[event];
        if (!cbEvent) return;
        const forceGetData = forceGetDataEvents.includes(cbEvent);
        this.emit(
          cbEvent,
          this.generateEventResponse(cbEvent, data, '', forceGetData)
        );
      },
      koffi.pointer(callbackTypes.listener)
    );

    if (emitProxy) {
      // @ts-ignore eslint-disable-next-line
      this.emit = emitProxy;
    }

    this.registerFunc();

    Object.assign(this, setupUserModule(this));
    Object.assign(this, setupFriendModule(this));
    Object.assign(this, setupGroupModule(this));
    Object.assign(this, setupConversationModule(this));
    Object.assign(this, setupMessageModule(this));
  }

  registerFunc = () => {
    this.nativeSdk.set_group_listener = this.lib.func(
      '__stdcall',
      'set_group_listener',
      'void',
      ['listenerCallback *']
    );
    this.nativeSdk.set_conversation_listener = this.lib.func(
      '__stdcall',
      'set_conversation_listener',
      'void',
      ['listenerCallback *']
    );
    this.nativeSdk.set_advanced_msg_listener = this.lib.func(
      '__stdcall',
      'set_advanced_msg_listener',
      'void',
      ['listenerCallback *']
    );
    this.nativeSdk.set_batch_msg_listener = this.lib.func(
      '__stdcall',
      'set_batch_msg_listener',
      'void',
      ['listenerCallback *']
    );
    this.nativeSdk.set_user_listener = this.lib.func(
      '__stdcall',
      'set_user_listener',
      'void',
      ['listenerCallback *']
    );
    this.nativeSdk.set_friend_listener = this.lib.func(
      '__stdcall',
      'set_friend_listener',
      'void',
      ['listenerCallback *']
    );
    this.nativeSdk.set_custom_business_listener = this.lib.func(
      '__stdcall',
      'set_custom_business_listener',
      'void',
      ['listenerCallback *']
    );
    this.nativeSdk.init_sdk = this.lib.func('__stdcall', 'init_sdk', 'uint8', [
      'listenerCallback *',
      'str',
      'str',
    ]);
    this.nativeSdk.un_init_sdk = this.lib.func(
      '__stdcall',
      'un_init_sdk',
      'void',
      ['str']
    );
    this.nativeSdk.login = this.lib.func('__stdcall', 'login', 'void', [
      'baseCallback *',
      'str',
      'str',
      'str',
    ]);
    this.nativeSdk.logout = this.lib.func('__stdcall', 'logout', 'void', [
      'baseCallback *',
      'str',
    ]);
    this.nativeSdk.set_app_background_status = this.lib.func(
      '__stdcall',
      'set_app_background_status',
      'void',
      ['baseCallback *', 'str', 'int']
    );
    this.nativeSdk.network_status_changed = this.lib.func(
      '__stdcall',
      'network_status_changed',
      'void',
      ['baseCallback *', 'str']
    );
    this.nativeSdk.get_login_status = this.lib.func(
      '__stdcall',
      'get_login_status',
      'long long',
      ['str']
    );
    this.nativeSdk.create_text_message = this.lib.func(
      '__stdcall',
      'create_text_message',
      'str',
      ['str', 'str']
    );
    this.nativeSdk.create_advanced_text_message = this.lib.func(
      '__stdcall',
      'create_advanced_text_message',
      'str',
      ['str', 'str', 'str']
    );
    this.nativeSdk.create_text_at_message = this.lib.func(
      '__stdcall',
      'create_text_at_message',
      'str',
      ['str', 'str', 'str', 'str', 'str']
    );
    this.nativeSdk.create_location_message = this.lib.func(
      '__stdcall',
      'create_location_message',
      'str',
      ['str', 'str', 'double', 'double']
    );
    this.nativeSdk.create_custom_message = this.lib.func(
      '__stdcall',
      'create_custom_message',
      'str',
      ['str', 'str', 'str', 'str']
    );
    this.nativeSdk.create_quote_message = this.lib.func(
      '__stdcall',
      'create_quote_message',
      'str',
      ['str', 'str', 'str']
    );
    this.nativeSdk.create_advanced_quote_message = this.lib.func(
      '__stdcall',
      'create_advanced_quote_message',
      'str',
      ['str', 'str', 'str', 'str']
    );
    this.nativeSdk.create_card_message = this.lib.func(
      '__stdcall',
      'create_card_message',
      'str',
      ['str', 'str']
    );
    this.nativeSdk.create_video_message_from_full_path = this.lib.func(
      '__stdcall',
      'create_video_message_from_full_path',
      'str',
      ['str', 'str', 'str', 'long long', 'str']
    );
    this.nativeSdk.create_image_message_from_full_path = this.lib.func(
      '__stdcall',
      'create_image_message_from_full_path',
      'str',
      ['str', 'str']
    );
    this.nativeSdk.create_sound_message_from_full_path = this.lib.func(
      '__stdcall',
      'create_sound_message_from_full_path',
      'str',
      ['str', 'str', 'long long']
    );
    this.nativeSdk.create_file_message_from_full_path = this.lib.func(
      '__stdcall',
      'create_file_message_from_full_path',
      'str',
      ['str', 'str', 'str']
    );
    this.nativeSdk.create_image_message = this.lib.func(
      '__stdcall',
      'create_image_message',
      'str',
      ['str', 'str']
    );
    this.nativeSdk.create_image_message_by_url = this.lib.func(
      '__stdcall',
      'create_image_message_by_url',
      'str',
      ['str', 'str', 'str', 'str', 'str']
    );
    this.nativeSdk.create_sound_message_by_url = this.lib.func(
      '__stdcall',
      'create_sound_message_by_url',
      'str',
      ['str', 'str']
    );
    this.nativeSdk.create_sound_message = this.lib.func(
      '__stdcall',
      'create_sound_message',
      'str',
      ['str', 'str', 'long long']
    );
    this.nativeSdk.create_video_message_by_url = this.lib.func(
      '__stdcall',
      'create_video_message_by_url',
      'str',
      ['str', 'str']
    );
    this.nativeSdk.create_video_message = this.lib.func(
      '__stdcall',
      'create_video_message',
      'str',
      ['str', 'str', 'str', 'long long', 'str']
    );
    this.nativeSdk.create_file_message_by_url = this.lib.func(
      '__stdcall',
      'create_file_message_by_url',
      'str',
      ['str', 'str']
    );
    this.nativeSdk.create_file_message = this.lib.func(
      '__stdcall',
      'create_file_message',
      'str',
      ['str', 'str', 'str']
    );
    this.nativeSdk.create_merger_message = this.lib.func(
      '__stdcall',
      'create_merger_message',
      'str',
      ['str', 'str', 'str', 'str']
    );
    this.nativeSdk.create_face_message = this.lib.func(
      '__stdcall',
      'create_face_message',
      'str',
      ['str', 'int', 'str']
    );
    this.nativeSdk.create_forward_message = this.lib.func(
      '__stdcall',
      'create_forward_message',
      'str',
      ['str', 'str']
    );
    this.nativeSdk.get_all_conversation_list = this.lib.func(
      '__stdcall',
      'get_all_conversation_list',
      'void',
      ['baseCallback *', 'str']
    );
    this.nativeSdk.get_conversation_list_split = this.lib.func(
      '__stdcall',
      'get_conversation_list_split',
      'void',
      ['baseCallback *', 'str', 'int', 'int']
    );
    this.nativeSdk.get_one_conversation = this.lib.func(
      '__stdcall',
      'get_one_conversation',
      'void',
      ['baseCallback *', 'str', 'int', 'str']
    );
    this.nativeSdk.get_multiple_conversation = this.lib.func(
      '__stdcall',
      'get_multiple_conversation',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.search_conversation = this.lib.func(
      '__stdcall',
      'search_conversation',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.hide_conversation = this.lib.func(
      '__stdcall',
      'hide_conversation',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.set_conversation_draft = this.lib.func(
      '__stdcall',
      'set_conversation_draft',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.nativeSdk.set_conversation = this.lib.func(
      '__stdcall',
      'set_conversation',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.nativeSdk.get_total_unread_msg_count = this.lib.func(
      '__stdcall',
      'get_total_unread_msg_count',
      'void',
      ['baseCallback *', 'str']
    );
    this.nativeSdk.get_at_all_tag = this.lib.func(
      '__stdcall',
      'get_at_all_tag',
      'str',
      ['str']
    );
    this.nativeSdk.send_message = this.lib.func(
      '__stdcall',
      'send_message',
      'void',
      ['sendMessageCallback *', 'str', 'str', 'str', 'str', 'str', 'int']
    );
    this.nativeSdk.send_message_not_oss = this.lib.func(
      '__stdcall',
      'send_message_not_oss',
      'void',
      ['sendMessageCallback *', 'str', 'str', 'str', 'str', 'str', 'int']
    );
    this.nativeSdk.find_message_list = this.lib.func(
      '__stdcall',
      'find_message_list',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.get_advanced_history_message_list = this.lib.func(
      '__stdcall',
      'get_advanced_history_message_list',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.get_advanced_history_message_list_reverse = this.lib.func(
      '__stdcall',
      'get_advanced_history_message_list_reverse',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.revoke_message = this.lib.func(
      '__stdcall',
      'revoke_message',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.nativeSdk.mark_conversation_message_as_read = this.lib.func(
      '__stdcall',
      'mark_conversation_message_as_read',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.mark_all_conversation_message_as_read = this.lib.func(
      '__stdcall',
      'mark_all_conversation_message_as_read',
      'void',
      ['baseCallback *', 'str']
    );
    this.nativeSdk.delete_message_from_local_storage = this.lib.func(
      '__stdcall',
      'delete_message_from_local_storage',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.nativeSdk.delete_message = this.lib.func(
      '__stdcall',
      'delete_message',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.nativeSdk.change_input_states = this.lib.func(
      '__stdcall',
      'change_input_states',
      'void',
      ['baseCallback *', 'str', 'str', 'int']
    );
    this.nativeSdk.get_input_states = this.lib.func(
      '__stdcall',
      'get_input_states',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.nativeSdk.hide_all_conversations = this.lib.func(
      '__stdcall',
      'hide_all_conversations',
      'void',
      ['baseCallback *', 'str']
    );
    this.nativeSdk.delete_all_msg_from_local_and_svr = this.lib.func(
      '__stdcall',
      'delete_all_msg_from_local_and_svr',
      'void',
      ['baseCallback *', 'str']
    );
    this.nativeSdk.delete_all_msg_from_local = this.lib.func(
      '__stdcall',
      'delete_all_msg_from_local',
      'void',
      ['baseCallback *', 'str']
    );
    this.nativeSdk.clear_conversation_and_delete_all_msg = this.lib.func(
      '__stdcall',
      'clear_conversation_and_delete_all_msg',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.delete_conversation_and_delete_all_msg = this.lib.func(
      '__stdcall',
      'delete_conversation_and_delete_all_msg',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.insert_single_message_to_local_storage = this.lib.func(
      '__stdcall',
      'insert_single_message_to_local_storage',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'str']
    );
    this.nativeSdk.insert_group_message_to_local_storage = this.lib.func(
      '__stdcall',
      'insert_group_message_to_local_storage',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'str']
    );
    this.nativeSdk.search_local_messages = this.lib.func(
      '__stdcall',
      'search_local_messages',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.set_message_local_ex = this.lib.func(
      '__stdcall',
      'set_message_local_ex',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'str']
    );
    this.nativeSdk.get_users_info = this.lib.func(
      '__stdcall',
      'get_users_info',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.set_self_info = this.lib.func(
      '__stdcall',
      'set_self_info',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.get_self_user_info = this.lib.func(
      '__stdcall',
      'get_self_user_info',
      'void',
      ['baseCallback *', 'str']
    );
    this.nativeSdk.subscribe_users_status = this.lib.func(
      '__stdcall',
      'subscribe_users_status',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.unsubscribe_users_status = this.lib.func(
      '__stdcall',
      'unsubscribe_users_status',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.get_subscribe_users_status = this.lib.func(
      '__stdcall',
      'get_subscribe_users_status',
      'void',
      ['baseCallback *', 'str']
    );
    this.nativeSdk.get_user_status = this.lib.func(
      '__stdcall',
      'get_user_status',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    // Friend functions
    this.nativeSdk.update_friends = this.lib.func(
      '__stdcall',
      'update_friends',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.get_specified_friends_info = this.lib.func(
      '__stdcall',
      'get_specified_friends_info',
      'void',
      ['baseCallback *', 'str', 'str', 'int']
    );
    this.nativeSdk.get_friend_list = this.lib.func(
      '__stdcall',
      'get_friend_list',
      'void',
      ['baseCallback *', 'str', 'int']
    );
    this.nativeSdk.get_friend_list_page = this.lib.func(
      '__stdcall',
      'get_friend_list_page',
      'void',
      ['baseCallback *', 'str', 'int', 'int', 'int']
    );
    this.nativeSdk.search_friends = this.lib.func(
      '__stdcall',
      'search_friends',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.check_friend = this.lib.func(
      '__stdcall',
      'check_friend',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.add_friend = this.lib.func(
      '__stdcall',
      'add_friend',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.delete_friend = this.lib.func(
      '__stdcall',
      'delete_friend',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.get_friend_application_list_as_recipient = this.lib.func(
      '__stdcall',
      'get_friend_application_list_as_recipient',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.get_friend_application_list_as_applicant = this.lib.func(
      '__stdcall',
      'get_friend_application_list_as_applicant',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.get_friend_application_unhandled_count = this.lib.func(
      '__stdcall',
      'get_friend_application_unhandled_count',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.accept_friend_application = this.lib.func(
      '__stdcall',
      'accept_friend_application',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.refuse_friend_application = this.lib.func(
      '__stdcall',
      'refuse_friend_application',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.add_black = this.lib.func('__stdcall', 'add_black', 'void', [
      'baseCallback *',
      'str',
      'str',
      'str',
    ]);
    this.nativeSdk.get_black_list = this.lib.func(
      '__stdcall',
      'get_black_list',
      'void',
      ['baseCallback *', 'str']
    );
    this.nativeSdk.remove_black = this.lib.func(
      '__stdcall',
      'remove_black',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    // Group functions
    this.nativeSdk.create_group = this.lib.func(
      '__stdcall',
      'create_group',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.join_group = this.lib.func(
      '__stdcall',
      'join_group',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'int', 'str']
    );
    this.nativeSdk.quit_group = this.lib.func(
      '__stdcall',
      'quit_group',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.dismiss_group = this.lib.func(
      '__stdcall',
      'dismiss_group',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.change_group_mute = this.lib.func(
      '__stdcall',
      'change_group_mute',
      'void',
      ['baseCallback *', 'str', 'str', 'int']
    );
    this.nativeSdk.change_group_member_mute = this.lib.func(
      '__stdcall',
      'change_group_member_mute',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'int']
    );
    this.nativeSdk.set_group_member_info = this.lib.func(
      '__stdcall',
      'set_group_member_info',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.get_joined_group_list = this.lib.func(
      '__stdcall',
      'get_joined_group_list',
      'void',
      ['baseCallback *', 'str']
    );
    this.nativeSdk.get_joined_group_list_page = this.lib.func(
      '__stdcall',
      'get_joined_group_list_page',
      'void',
      ['baseCallback *', 'str', 'int', 'int']
    );
    this.nativeSdk.get_specified_groups_info = this.lib.func(
      '__stdcall',
      'get_specified_groups_info',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.search_groups = this.lib.func(
      '__stdcall',
      'search_groups',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.set_group_info = this.lib.func(
      '__stdcall',
      'set_group_info',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.get_group_member_list = this.lib.func(
      '__stdcall',
      'get_group_member_list',
      'void',
      ['baseCallback *', 'str', 'str', 'int', 'int', 'int']
    );
    this.nativeSdk.get_group_member_owner_and_admin = this.lib.func(
      '__stdcall',
      'get_group_member_owner_and_admin',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.get_group_member_list_by_join_time_filter = this.lib.func(
      '__stdcall',
      'get_group_member_list_by_join_time_filter',
      'void',
      [
        'baseCallback *',
        'str',
        'str',
        'int',
        'int',
        'long long',
        'long long',
        'str',
      ]
    );
    this.nativeSdk.get_specified_group_members_info = this.lib.func(
      '__stdcall',
      'get_specified_group_members_info',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.nativeSdk.kick_group_member = this.lib.func(
      '__stdcall',
      'kick_group_member',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'str']
    );
    this.nativeSdk.transfer_group_owner = this.lib.func(
      '__stdcall',
      'transfer_group_owner',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.nativeSdk.invite_user_to_group = this.lib.func(
      '__stdcall',
      'invite_user_to_group',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'str']
    );
    this.nativeSdk.get_group_application_list_as_recipient = this.lib.func(
      '__stdcall',
      'get_group_application_list_as_recipient',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.get_group_application_list_as_applicant = this.lib.func(
      '__stdcall',
      'get_group_application_list_as_applicant',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.get_group_application_unhandled_count = this.lib.func(
      '__stdcall',
      'get_group_application_unhandled_count',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.accept_group_application = this.lib.func(
      '__stdcall',
      'accept_group_application',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'str']
    );
    this.nativeSdk.refuse_group_application = this.lib.func(
      '__stdcall',
      'refuse_group_application',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'str']
    );
    this.nativeSdk.search_group_members = this.lib.func(
      '__stdcall',
      'search_group_members',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.is_join_group = this.lib.func(
      '__stdcall',
      'is_join_group',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.nativeSdk.get_users_in_group = this.lib.func(
      '__stdcall',
      'get_users_in_group',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.nativeSdk.update_fcm_token = this.lib.func(
      '__stdcall',
      'update_fcm_token',
      'void',
      ['baseCallback *', 'str', 'str', 'long long']
    );
    this.nativeSdk.upload_file = this.lib.func(
      '__stdcall',
      'upload_file',
      'void',
      ['baseCallback *', 'str', 'str', 'listenerCallback *']
    );
    this.nativeSdk.upload_logs = this.lib.func(
      '__stdcall',
      'upload_logs',
      'void',
      ['baseCallback *', 'str', 'int', 'str', 'listenerCallback *']
    );
    this.nativeSdk.logs = this.lib.func('__stdcall', 'logs', 'void', [
      'baseCallback *',
      'str',
      'int',
      'str',
      'int',
      'str',
      'str',
      'str',
    ]);
  };

  generateEventResponse = (
    event: SdkEvent,
    data: unknown,
    operationID = '',
    forceGetData = false
  ): SdkResponse => {
    let errCode = 0;
    let errMsg = '';
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        // Keep non-JSON event payloads as strings.
      }
    }
    if (isRecord(data) && data.errCode !== undefined) {
      errCode = typeof data.errCode === 'number' ? data.errCode : 0;
      errMsg = typeof data.errMsg === 'string' ? data.errMsg : '';
      data = data.data;
    }
    if (forceGetData && isRecord(data)) {
      const values = Object.values(data);
      data = values[0];
    }
    return {
      event,
      errCode,
      errMsg,
      data,
      operationID,
    };
  };

  baseCallbackWrap = <T>(
    resolve: (response: SdkResponse<T>) => void,
    reject: (response: SdkResponse<T>) => void
  ) => {
    const registerBaseCallback = koffi.register(
      (operationID: string, errCode: number, errMsg: string, data: string) => {
        let realData: unknown;
        try {
          realData = JSON.parse(data);
        } catch {
          realData = data;
        }
        const response: SdkResponse<T> = {
          event: '',
          errCode,
          errMsg,
          data: realData as T,
          operationID,
        };
        if (errCode === 0) {
          resolve(response);
        } else {
          reject(response);
        }
        koffi.unregister(registerBaseCallback);
      },
      koffi.pointer(this.baseCallbackProto)
    );
    return registerBaseCallback;
  };

  sendMessageCallbackWrap = <T>(
    clientMsgID: string,
    resolve: (response: SdkResponse<T>) => void,
    reject: (response: SdkResponse<T>) => void
  ) => {
    const registerSendMessageCallback = koffi.register(
      (
        operationID: string,
        errCode: number,
        errMsg: string,
        data: string,
        progress: number
      ) => {
        let realData: unknown;
        try {
          realData = JSON.parse(data);
        } catch {
          realData = data;
        }
        const response: SdkResponse<T> = {
          event: '',
          errCode,
          errMsg,
          data: realData as T,
          operationID,
        };
        if (!errCode && !errMsg && !data) {
          // eslint-disable-next-line
          this.emit(
            SdkEvent.OnProgress,
            this.generateEventResponse(
              SdkEvent.OnProgress,
              {
                clientMsgID,
                progress,
              },
              operationID
            )
          );
          return;
        }
        if (errCode === 0) {
          resolve(response);
        } else {
          reject(response);
        }
        koffi.unregister(registerSendMessageCallback);
      },
      koffi.pointer(this.sendMessageCallbackProto)
    );
    return registerSendMessageCallback;
  };

  asyncReturnWrap = <T>(operationID: string, data: unknown) =>
    new Promise<SdkResponse<T>>((resolve, reject) => {
      const hasError =
        (data === undefined || data === null) &&
        !operationID.includes('unInitSDK');
      if (data && typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          // Keep non-JSON synchronous return values as strings.
        }
      }
      const response = {
        event: '',
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
    this.nativeSdk.set_user_listener(this.listenerCallback);
    this.nativeSdk.set_friend_listener(this.listenerCallback);
    this.nativeSdk.set_group_listener(this.listenerCallback);
    this.nativeSdk.set_conversation_listener(this.listenerCallback);
    this.nativeSdk.set_advanced_msg_listener(this.listenerCallback);
    this.nativeSdk.set_batch_msg_listener(this.listenerCallback);
    this.nativeSdk.set_custom_business_listener(this.listenerCallback);
  };

  initSDK = (param: InitConfig, opid = uuidV4()) =>
    new Promise<boolean>((resolve, reject) => {
      const flag = this.nativeSdk.init_sdk(
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

  login = (param: NativeLoginParams, opid = uuidV4()) =>
    new Promise<SdkResponse<void>>((resolve, reject) => {
      const loginCallback = this.baseCallbackWrap<void>(resolve, reject);
      this.nativeSdk.login(loginCallback, opid, param.userID, param.token);
    });

  getLoginStatus = (opid = uuidV4()) =>
    this.asyncReturnWrap<LoginStatus>(
      opid,
      this.nativeSdk.get_login_status(opid)
    );

  logout = (opid = uuidV4()) =>
    new Promise<SdkResponse<void>>((resolve, reject) => {
      const logoutCallback = this.baseCallbackWrap<void>(resolve, reject);
      this.nativeSdk.logout(logoutCallback, opid);
    });

  unInitSDK = (opid = uuidV4()) =>
    this.asyncReturnWrap(
      `unInitSDK-${opid}`,
      this.nativeSdk.un_init_sdk(`unInitSDK-${opid}`)
    );

  setAppBackgroundStatus = (isInBackground: boolean, opid = uuidV4()) =>
    new Promise<SdkResponse<void>>((resolve, reject) => {
      this.nativeSdk.set_app_background_status(
        this.baseCallbackWrap<void>(resolve, reject),
        opid,
        isInBackground ? 1 : 0
      );
    });

  networkStatusChanged = (opid = uuidV4()) =>
    new Promise<SdkResponse<void>>((resolve, reject) => {
      this.nativeSdk.network_status_changed(
        this.baseCallbackWrap<void>(resolve, reject),
        opid
      );
    });

  updateFcmToken = (fcmToken: string, expireTime: number, opid = uuidV4()) =>
    new Promise<SdkResponse<void>>((resolve, reject) => {
      this.nativeSdk.update_fcm_token(
        this.baseCallbackWrap<void>(resolve, reject),
        opid,
        fcmToken,
        expireTime
      );
    });

  uploadFile = (params: UploadFileParams, opid = uuidV4()) =>
    new Promise<SdkResponse<{ url: string }>>((resolve, reject) => {
      this.nativeSdk.upload_file(
        this.baseCallbackWrap(resolve, reject),
        opid,
        JSON.stringify(params),
        this.listenerCallback
      );
    });

  uploadLogs = (params: UploadLogsParams, opid = uuidV4()) =>
    new Promise<SdkResponse<void>>((resolve, reject) => {
      this.nativeSdk.upload_logs(
        this.baseCallbackWrap(resolve, reject),
        opid,
        params.line,
        params.ex || '',
        this.listenerCallback
      );
    });

  verboseLogs = (params: LogMessageParams, opid = uuidV4()) =>
    new Promise<SdkResponse<void>>((resolve, reject) => {
      this.nativeSdk.logs(
        this.baseCallbackWrap(resolve, reject),
        opid,
        LogLevel.Verbose,
        '',
        0,
        params.msgs,
        '',
        JSON.stringify(params.keyAndValue)
      );
    });
  debugLogs = (params: LogMessageParams, opid = uuidV4()) =>
    new Promise<SdkResponse<void>>((resolve, reject) => {
      this.nativeSdk.logs(
        this.baseCallbackWrap(resolve, reject),
        opid,
        LogLevel.Debug,
        '',
        0,
        params.msgs,
        '',
        JSON.stringify(params.keyAndValue)
      );
    });
  infoLogs = (params: LogMessageParams, opid = uuidV4()) =>
    new Promise<SdkResponse<void>>((resolve, reject) => {
      this.nativeSdk.logs(
        this.baseCallbackWrap(resolve, reject),
        opid,
        LogLevel.Info,
        '',
        0,
        params.msgs,
        '',
        JSON.stringify(params.keyAndValue)
      );
    });
  warnLogs = (params: LogErrorParams, opid = uuidV4()) =>
    new Promise<SdkResponse<void>>((resolve, reject) => {
      this.nativeSdk.logs(
        this.baseCallbackWrap(resolve, reject),
        opid,
        LogLevel.Warn,
        '',
        0,
        params.msgs,
        params.err,
        JSON.stringify([])
      );
    });
  errorLogs = (params: LogErrorParams, opid = uuidV4()) =>
    new Promise<SdkResponse<void>>((resolve, reject) => {
      this.nativeSdk.logs(
        this.baseCallbackWrap(resolve, reject),
        opid,
        LogLevel.Error,
        '',
        0,
        params.msgs,
        params.err,
        JSON.stringify([])
      );
    });
  fatalLogs = (params: LogErrorParams, opid = uuidV4()) =>
    new Promise<SdkResponse<void>>((resolve, reject) => {
      this.nativeSdk.logs(
        this.baseCallbackWrap(resolve, reject),
        opid,
        LogLevel.Fatal,
        '',
        0,
        params.msgs,
        params.err,
        JSON.stringify([])
      );
    });
  panicLogs = (params: LogErrorParams, opid = uuidV4()) =>
    new Promise<SdkResponse<void>>((resolve, reject) => {
      this.nativeSdk.logs(
        this.baseCallbackWrap(resolve, reject),
        opid,
        LogLevel.Panic,
        '',
        0,
        params.msgs,
        params.err,
        JSON.stringify([])
      );
    });

  // implements user api
  getSelfUserInfo!: UserModuleApi['getSelfUserInfo'];
  setSelfInfo!: UserModuleApi['setSelfInfo'];
  getUsersInfo!: UserModuleApi['getUsersInfo'];
  subscribeUsersStatus!: UserModuleApi['subscribeUsersStatus'];
  unsubscribeUsersStatus!: UserModuleApi['unsubscribeUsersStatus'];
  getSubscribeUsersStatus!: UserModuleApi['getSubscribeUsersStatus'];
  getUserStatus!: UserModuleApi['getUserStatus'];

  // implements friend api
  acceptFriendApplication!: FriendModuleApi['acceptFriendApplication'];
  addBlack!: FriendModuleApi['addBlack'];
  addFriend!: FriendModuleApi['addFriend'];
  checkFriend!: FriendModuleApi['checkFriend'];
  deleteFriend!: FriendModuleApi['deleteFriend'];
  getBlackList!: FriendModuleApi['getBlackList'];
  getFriendApplicationListAsApplicant!: FriendModuleApi['getFriendApplicationListAsApplicant'];
  getFriendApplicationListAsRecipient!: FriendModuleApi['getFriendApplicationListAsRecipient'];
  getFriendApplicationUnhandledCount!: FriendModuleApi['getFriendApplicationUnhandledCount'];
  getFriendList!: FriendModuleApi['getFriendList'];
  getFriendListPage!: FriendModuleApi['getFriendListPage'];
  getSpecifiedFriendsInfo!: FriendModuleApi['getSpecifiedFriendsInfo'];
  refuseFriendApplication!: FriendModuleApi['refuseFriendApplication'];
  removeBlack!: FriendModuleApi['removeBlack'];
  searchFriends!: FriendModuleApi['searchFriends'];
  updateFriends!: FriendModuleApi['updateFriends'];

  // implements group api
  createGroup!: GroupModuleApi['createGroup'];
  joinGroup!: GroupModuleApi['joinGroup'];
  inviteUserToGroup!: GroupModuleApi['inviteUserToGroup'];
  getJoinedGroupList!: GroupModuleApi['getJoinedGroupList'];
  getJoinedGroupListPage!: GroupModuleApi['getJoinedGroupListPage'];
  searchGroups!: GroupModuleApi['searchGroups'];
  getSpecifiedGroupsInfo!: GroupModuleApi['getSpecifiedGroupsInfo'];
  setGroupInfo!: GroupModuleApi['setGroupInfo'];
  getGroupApplicationListAsRecipient!: GroupModuleApi['getGroupApplicationListAsRecipient'];
  getGroupApplicationListAsApplicant!: GroupModuleApi['getGroupApplicationListAsApplicant'];
  getGroupApplicationUnhandledCount!: GroupModuleApi['getGroupApplicationUnhandledCount'];
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
  isJoinGroup!: GroupModuleApi['isJoinGroup'];
  getUsersInGroup!: GroupModuleApi['getUsersInGroup'];

  // implements conversation api
  getAllConversationList!: ConversationModuleApi['getAllConversationList'];
  getConversationListSplit!: ConversationModuleApi['getConversationListSplit'];
  getOneConversation!: ConversationModuleApi['getOneConversation'];
  getMultipleConversation!: ConversationModuleApi['getMultipleConversation'];
  searchConversation!: ConversationModuleApi['searchConversation'];
  getTotalUnreadMsgCount!: ConversationModuleApi['getTotalUnreadMsgCount'];
  markConversationMessageAsRead!: ConversationModuleApi['markConversationMessageAsRead'];
  markAllConversationMessageAsRead!: ConversationModuleApi['markAllConversationMessageAsRead'];
  setConversationDraft!: ConversationModuleApi['setConversationDraft'];
  setConversation!: ConversationModuleApi['setConversation'];
  hideConversation!: ConversationModuleApi['hideConversation'];
  hideAllConversations!: ConversationModuleApi['hideAllConversations'];
  clearConversationAndDeleteAllMsg!: ConversationModuleApi['clearConversationAndDeleteAllMsg'];
  deleteConversationAndDeleteAllMsg!: ConversationModuleApi['deleteConversationAndDeleteAllMsg'];
  changeInputStates!: ConversationModuleApi['changeInputStates'];
  getInputStates!: ConversationModuleApi['getInputStates'];

  // implements message api
  createTextMessage!: MessageModuleApi['createTextMessage'];
  createAdvancedTextMessage!: MessageModuleApi['createAdvancedTextMessage'];
  createAdvancedQuoteMessage!: MessageModuleApi['createAdvancedQuoteMessage'];
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
  createImageMessageByURL!: MessageModuleApi['createImageMessageByURL'];
  createVideoMessage!: MessageModuleApi['createVideoMessage'];
  createVideoMessageFromFullPath!: MessageModuleApi['createVideoMessageFromFullPath'];
  createVideoMessageByURL!: MessageModuleApi['createVideoMessageByURL'];
  createSoundMessage!: MessageModuleApi['createSoundMessage'];
  createSoundMessageFromFullPath!: MessageModuleApi['createSoundMessageFromFullPath'];
  createSoundMessageByURL!: MessageModuleApi['createSoundMessageByURL'];
  createFileMessage!: MessageModuleApi['createFileMessage'];
  createFileMessageFromFullPath!: MessageModuleApi['createFileMessageFromFullPath'];
  createFileMessageByURL!: MessageModuleApi['createFileMessageByURL'];
  getAdvancedHistoryMessageList!: MessageModuleApi['getAdvancedHistoryMessageList'];
  getAdvancedHistoryMessageListReverse!: MessageModuleApi['getAdvancedHistoryMessageListReverse'];
  sendMessage!: MessageModuleApi['sendMessage'];
  sendMessageNotOss!: MessageModuleApi['sendMessageNotOss'];
  findMessageList!: MessageModuleApi['findMessageList'];
  getAtAllTag!: MessageModuleApi['getAtAllTag'];
  revokeMessage!: MessageModuleApi['revokeMessage'];
  deleteMessageFromLocalStorage!: MessageModuleApi['deleteMessageFromLocalStorage'];
  deleteMessage!: MessageModuleApi['deleteMessage'];
  deleteAllMsgFromLocalAndSvr!: MessageModuleApi['deleteAllMsgFromLocalAndSvr'];
  deleteAllMsgFromLocal!: MessageModuleApi['deleteAllMsgFromLocal'];
  searchLocalMessages!: MessageModuleApi['searchLocalMessages'];
  insertGroupMessageToLocalStorage!: MessageModuleApi['insertGroupMessageToLocalStorage'];
  insertSingleMessageToLocalStorage!: MessageModuleApi['insertSingleMessageToLocalStorage'];
  setMessageLocalEx!: MessageModuleApi['setMessageLocalEx'];
}

export default OpenIMSdk;
