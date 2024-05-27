import koffi from 'koffi';
import { v4 as uuidV4 } from 'uuid';
import type { LibOpenIMSDK } from 'libOpenIMSDK';
import { UserModuleApi, setupUserModule } from './modules/user';
import { InitConfig, LoginParams } from '@/types/params';
import { BaseResponse, EmitProxy } from '@/types/entity';
import { ErrorCode } from '@/constant/api';
import { NativeEvent, eventMapping } from '@/constant/callback';
import Emitter from '@/utils/emitter';
import { type FriendModuleApi, setupFriendModule } from './modules/friend';
import { type GroupModuleApi, setupGroupModule } from './modules/group';
import {
  type ConversationModuleApi,
  setupConversationModule,
} from './modules/conversation';
import { type MessageModuleApi, setupMessageModule } from './modules/message';
import { CbEvents, LoginStatus } from 'open-im-sdk-wasm';
import { SelfUserInfo } from 'open-im-sdk-wasm/lib/types/entity';
import {
  SetConversationExParams,
  SetFriendExParams,
  UploadFileParams,
} from 'open-im-sdk-wasm/lib/types/params';
import {
  type SignalingModuleApi,
  setupSignalingModule,
} from './modules/signaling';

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
    MessageModuleApi,
    SignalingModuleApi
{
  libOpenIMSDK = {} as LibOpenIMSDK;
  baseCallbackProto: koffi.IKoffiCType;
  sendMessageCallbackProto: koffi.IKoffiCType;
  listenerCallback: koffi.IKoffiRegisteredCallback;
  lib: koffi.IKoffiLib;

  constructor(libPath: string, emitProxy?: EmitProxy) {
    super();
    this.lib = koffi.load(libPath);
    this.baseCallbackProto = koffi.proto('__stdcall', 'baseCallback', 'void', [
      'str',
      'int',
      'str',
      'str',
    ]);
    this.sendMessageCallbackProto = koffi.proto(
      '__stdcall',
      'sendMessageCallback',
      'void',
      ['str', 'int', 'str', 'str', 'int']
    );
    const listenerCallbackProto = koffi.proto(
      '__stdcall',
      'listenerCallback',
      'void',
      ['int', 'str']
    );

    if (emitProxy) {
      // @ts-ignore eslint-disable-next-line
      this.emit = emitProxy;
    }

    this.listenerCallback = koffi.register(
      (event: NativeEvent, data: string) => {
        const cbEvent = eventMapping[event];
        if (!cbEvent) return;
        this.emit(cbEvent, this.generateEventResponse(data));
      },
      koffi.pointer(listenerCallbackProto)
    );

    this.libOpenIMSDK.set_group_listener = this.lib.func(
      '__stdcall',
      'set_group_listener',
      'void',
      ['listenerCallback *']
    );
    this.libOpenIMSDK.set_conversation_listener = this.lib.func(
      '__stdcall',
      'set_conversation_listener',
      'void',
      ['listenerCallback *']
    );
    this.libOpenIMSDK.set_advanced_msg_listener = this.lib.func(
      '__stdcall',
      'set_advanced_msg_listener',
      'void',
      ['listenerCallback *']
    );
    this.libOpenIMSDK.set_batch_msg_listener = this.lib.func(
      '__stdcall',
      'set_batch_msg_listener',
      'void',
      ['listenerCallback *']
    );
    this.libOpenIMSDK.set_user_listener = this.lib.func(
      '__stdcall',
      'set_user_listener',
      'void',
      ['listenerCallback *']
    );
    this.libOpenIMSDK.set_friend_listener = this.lib.func(
      '__stdcall',
      'set_friend_listener',
      'void',
      ['listenerCallback *']
    );
    this.libOpenIMSDK.set_custom_business_listener = this.lib.func(
      '__stdcall',
      'set_custom_business_listener',
      'void',
      ['listenerCallback *']
    );
    this.libOpenIMSDK.set_signaling_listener = this.lib.func(
      '__stdcall',
      'set_signaling_listener',
      'void',
      ['listenerCallback *']
    );
    this.libOpenIMSDK.init_sdk = this.lib.func(
      '__stdcall',
      'init_sdk',
      'uint8',
      ['listenerCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.un_init_sdk = this.lib.func(
      '__stdcall',
      'un_init_sdk',
      'void',
      ['str']
    );
    this.libOpenIMSDK.login = this.lib.func('__stdcall', 'login', 'void', [
      'baseCallback *',
      'str',
      'str',
      'str',
    ]);
    this.libOpenIMSDK.logout = this.lib.func('__stdcall', 'logout', 'void', [
      'baseCallback *',
      'str',
    ]);
    this.libOpenIMSDK.set_app_background_status = this.lib.func(
      '__stdcall',
      'set_app_background_status',
      'void',
      ['baseCallback *', 'str', 'int']
    );
    this.libOpenIMSDK.network_status_changed = this.lib.func(
      '__stdcall',
      'network_status_changed',
      'void',
      ['baseCallback *', 'str']
    );
    this.libOpenIMSDK.get_login_status = this.lib.func(
      '__stdcall',
      'get_login_status',
      'int',
      ['str']
    );
    this.libOpenIMSDK.get_login_user = this.lib.func(
      '__stdcall',
      'get_login_user',
      'str',
      []
    );
    this.libOpenIMSDK.create_text_message = this.lib.func(
      '__stdcall',
      'create_text_message',
      'str',
      ['str', 'str']
    );
    this.libOpenIMSDK.create_advanced_text_message = this.lib.func(
      '__stdcall',
      'create_advanced_text_message',
      'str',
      ['str', 'str', 'str']
    );
    this.libOpenIMSDK.create_text_at_message = this.lib.func(
      '__stdcall',
      'create_text_at_message',
      'str',
      ['str', 'str', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.create_location_message = this.lib.func(
      '__stdcall',
      'create_location_message',
      'str',
      ['str', 'str', 'double', 'double']
    );
    this.libOpenIMSDK.create_custom_message = this.lib.func(
      '__stdcall',
      'create_custom_message',
      'str',
      ['str', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.create_quote_message = this.lib.func(
      '__stdcall',
      'create_quote_message',
      'str',
      ['str', 'str', 'str']
    );
    this.libOpenIMSDK.create_advanced_quote_message = this.lib.func(
      '__stdcall',
      'create_advanced_quote_message',
      'str',
      ['str', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.create_card_message = this.lib.func(
      '__stdcall',
      'create_card_message',
      'str',
      ['str', 'str']
    );
    this.libOpenIMSDK.create_video_message_from_full_path = this.lib.func(
      '__stdcall',
      'create_video_message_from_full_path',
      'str',
      ['str', 'str', 'str', 'long long', 'str']
    );
    this.libOpenIMSDK.create_image_message_from_full_path = this.lib.func(
      '__stdcall',
      'create_image_message_from_full_path',
      'str',
      ['str', 'str']
    );
    this.libOpenIMSDK.create_sound_message_from_full_path = this.lib.func(
      '__stdcall',
      'create_sound_message_from_full_path',
      'str',
      ['str', 'str', 'long long']
    );
    this.libOpenIMSDK.create_file_message_from_full_path = this.lib.func(
      '__stdcall',
      'create_file_message_from_full_path',
      'str',
      ['str', 'str', 'str']
    );
    this.libOpenIMSDK.create_image_message = this.lib.func(
      '__stdcall',
      'create_image_message',
      'str',
      ['str', 'str']
    );
    this.libOpenIMSDK.create_image_message_by_url = this.lib.func(
      '__stdcall',
      'create_image_message_by_url',
      'str',
      ['str', 'str', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.create_sound_message_by_url = this.lib.func(
      '__stdcall',
      'create_sound_message_by_url',
      'str',
      ['str', 'str']
    );
    this.libOpenIMSDK.create_sound_message = this.lib.func(
      '__stdcall',
      'create_sound_message',
      'str',
      ['str', 'str', 'long long']
    );
    this.libOpenIMSDK.create_video_message_by_url = this.lib.func(
      '__stdcall',
      'create_video_message_by_url',
      'str',
      ['str', 'str']
    );
    this.libOpenIMSDK.create_video_message = this.lib.func(
      '__stdcall',
      'create_video_message',
      'str',
      ['str', 'str', 'str', 'long long', 'str']
    );
    this.libOpenIMSDK.create_file_message_by_url = this.lib.func(
      '__stdcall',
      'create_file_message_by_url',
      'str',
      ['str', 'str']
    );
    this.libOpenIMSDK.create_file_message = this.lib.func(
      '__stdcall',
      'create_file_message',
      'str',
      ['str', 'str', 'str']
    );
    this.libOpenIMSDK.create_merger_message = this.lib.func(
      '__stdcall',
      'create_merger_message',
      'str',
      ['str', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.create_face_message = this.lib.func(
      '__stdcall',
      'create_face_message',
      'str',
      ['str', 'int', 'str']
    );
    this.libOpenIMSDK.create_forward_message = this.lib.func(
      '__stdcall',
      'create_forward_message',
      'str',
      ['str', 'str']
    );
    this.libOpenIMSDK.get_all_conversation_list = this.lib.func(
      '__stdcall',
      'get_all_conversation_list',
      'void',
      ['baseCallback *', 'str']
    );
    this.libOpenIMSDK.get_conversation_list_split = this.lib.func(
      '__stdcall',
      'get_conversation_list_split',
      'void',
      ['baseCallback *', 'str', 'int', 'int']
    );
    this.libOpenIMSDK.get_one_conversation = this.lib.func(
      '__stdcall',
      'get_one_conversation',
      'void',
      ['baseCallback *', 'str', 'int', 'str']
    );
    this.libOpenIMSDK.get_multiple_conversation = this.lib.func(
      '__stdcall',
      'get_multiple_conversation',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.set_conversation_msg_destruct_time = this.lib.func(
      '__stdcall',
      'set_conversation_msg_destruct_time',
      'void',
      ['baseCallback *', 'str', 'str', 'long long']
    );
    this.libOpenIMSDK.set_conversation_is_msg_destruct = this.lib.func(
      '__stdcall',
      'set_conversation_is_msg_destruct',
      'void',
      ['baseCallback *', 'str', 'str', 'int']
    );
    this.libOpenIMSDK.send_group_message_read_receipt = this.lib.func(
      '__stdcall',
      'send_group_message_read_receipt',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.get_group_message_reader_list = this.lib.func(
      '__stdcall',
      'get_group_message_reader_list',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'int', 'int', 'int']
    );
    this.libOpenIMSDK.hide_conversation = this.lib.func(
      '__stdcall',
      'hide_conversation',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.get_conversation_recv_message_opt = this.lib.func(
      '__stdcall',
      'get_conversation_recv_message_opt',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.set_conversation_draft = this.lib.func(
      '__stdcall',
      'set_conversation_draft',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.reset_conversation_group_at_type = this.lib.func(
      '__stdcall',
      'reset_conversation_group_at_type',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.pin_conversation = this.lib.func(
      '__stdcall',
      'pin_conversation',
      'void',
      ['baseCallback *', 'str', 'str', 'int']
    );
    this.libOpenIMSDK.set_conversation_private_chat = this.lib.func(
      '__stdcall',
      'set_conversation_private_chat',
      'void',
      ['baseCallback *', 'str', 'str', 'int']
    );
    this.libOpenIMSDK.set_conversation_burn_duration = this.lib.func(
      '__stdcall',
      'set_conversation_burn_duration',
      'void',
      ['baseCallback *', 'str', 'str', 'int']
    );
    this.libOpenIMSDK.set_conversation_recv_message_opt = this.lib.func(
      '__stdcall',
      'set_conversation_recv_message_opt',
      'void',
      ['baseCallback *', 'str', 'str', 'int']
    );
    this.libOpenIMSDK.get_total_unread_msg_count = this.lib.func(
      '__stdcall',
      'get_total_unread_msg_count',
      'void',
      ['baseCallback *', 'str']
    );
    this.libOpenIMSDK.get_at_all_tag = this.lib.func(
      '__stdcall',
      'get_at_all_tag',
      'str',
      ['str']
    );
    this.libOpenIMSDK.get_conversation_id_by_session_type = this.lib.func(
      '__stdcall',
      'get_conversation_id_by_session_type',
      'str',
      ['str', 'str', 'int']
    );
    this.libOpenIMSDK.send_message = this.lib.func(
      '__stdcall',
      'send_message',
      'void',
      ['sendMessageCallback *', 'str', 'str', 'str', 'str', 'str', 'int']
    );
    this.libOpenIMSDK.send_message_not_oss = this.lib.func(
      '__stdcall',
      'send_message_not_oss',
      'void',
      ['sendMessageCallback *', 'str', 'str', 'str', 'str', 'str', 'int']
    );
    this.libOpenIMSDK.find_message_list = this.lib.func(
      '__stdcall',
      'find_message_list',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.get_advanced_history_message_list = this.lib.func(
      '__stdcall',
      'get_advanced_history_message_list',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.get_advanced_history_message_list_reverse = this.lib.func(
      '__stdcall',
      'get_advanced_history_message_list_reverse',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.revoke_message = this.lib.func(
      '__stdcall',
      'revoke_message',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.typing_status_update = this.lib.func(
      '__stdcall',
      'typing_status_update',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.mark_conversation_message_as_read = this.lib.func(
      '__stdcall',
      'mark_conversation_message_as_read',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.delete_message_from_local_storage = this.lib.func(
      '__stdcall',
      'delete_message_from_local_storage',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.delete_message = this.lib.func(
      '__stdcall',
      'delete_message',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.hide_all_conversations = this.lib.func(
      '__stdcall',
      'hide_all_conversations',
      'void',
      ['baseCallback *', 'str']
    );
    this.libOpenIMSDK.delete_all_msg_from_local_and_svr = this.lib.func(
      '__stdcall',
      'delete_all_msg_from_local_and_svr',
      'void',
      ['baseCallback *', 'str']
    );
    this.libOpenIMSDK.delete_all_msg_from_local = this.lib.func(
      '__stdcall',
      'delete_all_msg_from_local',
      'void',
      ['baseCallback *', 'str']
    );
    this.libOpenIMSDK.clear_conversation_and_delete_all_msg = this.lib.func(
      '__stdcall',
      'clear_conversation_and_delete_all_msg',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.delete_conversation_and_delete_all_msg = this.lib.func(
      '__stdcall',
      'delete_conversation_and_delete_all_msg',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.insert_single_message_to_local_storage = this.lib.func(
      '__stdcall',
      'insert_single_message_to_local_storage',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.insert_group_message_to_local_storage = this.lib.func(
      '__stdcall',
      'insert_group_message_to_local_storage',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.search_local_messages = this.lib.func(
      '__stdcall',
      'search_local_messages',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.set_message_local_ex = this.lib.func(
      '__stdcall',
      'set_message_local_ex',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.get_users_info = this.lib.func(
      '__stdcall',
      'get_users_info',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.get_users_info_with_cache = this.lib.func(
      '__stdcall',
      'get_users_info_with_cache',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.set_self_info = this.lib.func(
      '__stdcall',
      'set_self_info',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.set_global_recv_message_opt = this.lib.func(
      '__stdcall',
      'set_global_recv_message_opt',
      'void',
      ['baseCallback *', 'str', 'int']
    );
    this.libOpenIMSDK.get_self_user_info = this.lib.func(
      '__stdcall',
      'get_self_user_info',
      'void',
      ['baseCallback *', 'str']
    );
    this.libOpenIMSDK.subscribe_users_status = this.lib.func(
      '__stdcall',
      'subscribe_users_status',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.unsubscribe_users_status = this.lib.func(
      '__stdcall',
      'unsubscribe_users_status',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.get_subscribe_users_status = this.lib.func(
      '__stdcall',
      'get_subscribe_users_status',
      'void',
      ['baseCallback *', 'str']
    );
    this.libOpenIMSDK.get_user_status = this.lib.func(
      '__stdcall',
      'get_user_status',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    // Friend functions
    this.libOpenIMSDK.get_specified_friends_info = this.lib.func(
      '__stdcall',
      'get_specified_friends_info',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.get_friend_list = this.lib.func(
      '__stdcall',
      'get_friend_list',
      'void',
      ['baseCallback *', 'str']
    );
    this.libOpenIMSDK.get_friend_list_page = this.lib.func(
      '__stdcall',
      'get_friend_list_page',
      'void',
      ['baseCallback *', 'str', 'int', 'int']
    );
    this.libOpenIMSDK.search_friends = this.lib.func(
      '__stdcall',
      'search_friends',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.check_friend = this.lib.func(
      '__stdcall',
      'check_friend',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.add_friend = this.lib.func(
      '__stdcall',
      'add_friend',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.set_friend_remark = this.lib.func(
      '__stdcall',
      'set_friend_remark',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.delete_friend = this.lib.func(
      '__stdcall',
      'delete_friend',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.get_friend_application_list_as_recipient = this.lib.func(
      '__stdcall',
      'get_friend_application_list_as_recipient',
      'void',
      ['baseCallback *', 'str']
    );
    this.libOpenIMSDK.get_friend_application_list_as_applicant = this.lib.func(
      '__stdcall',
      'get_friend_application_list_as_applicant',
      'void',
      ['baseCallback *', 'str']
    );
    this.libOpenIMSDK.accept_friend_application = this.lib.func(
      '__stdcall',
      'accept_friend_application',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.refuse_friend_application = this.lib.func(
      '__stdcall',
      'refuse_friend_application',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.add_black = this.lib.func(
      '__stdcall',
      'add_black',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.get_black_list = this.lib.func(
      '__stdcall',
      'get_black_list',
      'void',
      ['baseCallback *', 'str']
    );
    this.libOpenIMSDK.remove_black = this.lib.func(
      '__stdcall',
      'remove_black',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    // Group functions
    this.libOpenIMSDK.create_group = this.lib.func(
      '__stdcall',
      'create_group',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.join_group = this.lib.func(
      '__stdcall',
      'join_group',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'int']
    );
    this.libOpenIMSDK.quit_group = this.lib.func(
      '__stdcall',
      'quit_group',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.dismiss_group = this.lib.func(
      '__stdcall',
      'dismiss_group',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.change_group_mute = this.lib.func(
      '__stdcall',
      'change_group_mute',
      'void',
      ['baseCallback *', 'str', 'str', 'int']
    );
    this.libOpenIMSDK.change_group_member_mute = this.lib.func(
      '__stdcall',
      'change_group_member_mute',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'int']
    );
    this.libOpenIMSDK.set_group_member_role_level = this.lib.func(
      '__stdcall',
      'set_group_member_role_level',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'int']
    );
    this.libOpenIMSDK.set_group_member_info = this.lib.func(
      '__stdcall',
      'set_group_member_info',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.get_joined_group_list = this.lib.func(
      '__stdcall',
      'get_joined_group_list',
      'void',
      ['baseCallback *', 'str']
    );
    this.libOpenIMSDK.get_specified_groups_info = this.lib.func(
      '__stdcall',
      'get_specified_groups_info',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.search_groups = this.lib.func(
      '__stdcall',
      'search_groups',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.set_group_info = this.lib.func(
      '__stdcall',
      'set_group_info',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.get_group_member_list = this.lib.func(
      '__stdcall',
      'get_group_member_list',
      'void',
      ['baseCallback *', 'str', 'str', 'int', 'int', 'int']
    );
    this.libOpenIMSDK.get_group_member_owner_and_admin = this.lib.func(
      '__stdcall',
      'get_group_member_owner_and_admin',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.get_group_member_list_by_join_time_filter = this.lib.func(
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
    this.libOpenIMSDK.get_specified_group_members_info = this.lib.func(
      '__stdcall',
      'get_specified_group_members_info',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.kick_group_member = this.lib.func(
      '__stdcall',
      'kick_group_member',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.transfer_group_owner = this.lib.func(
      '__stdcall',
      'transfer_group_owner',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.invite_user_to_group = this.lib.func(
      '__stdcall',
      'invite_user_to_group',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.get_group_application_list_as_recipient = this.lib.func(
      '__stdcall',
      'get_group_application_list_as_recipient',
      'void',
      ['baseCallback *', 'str']
    );
    this.libOpenIMSDK.get_group_application_list_as_applicant = this.lib.func(
      '__stdcall',
      'get_group_application_list_as_applicant',
      'void',
      ['baseCallback *', 'str']
    );
    this.libOpenIMSDK.accept_group_application = this.lib.func(
      '__stdcall',
      'accept_group_application',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.refuse_group_application = this.lib.func(
      '__stdcall',
      'refuse_group_application',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'str']
    );
    this.libOpenIMSDK.search_group_members = this.lib.func(
      '__stdcall',
      'search_group_members',
      'void',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.is_join_group = this.lib.func(
      '__stdcall',
      'is_join_group',
      'int',
      ['baseCallback *', 'str', 'str']
    );
    this.libOpenIMSDK.signaling_invite_in_group = this.lib.func(
      '__stdcall',
      'signaling_invite_in_group',
      'void',
      ['baseCallback *', 'str', 'str']
    );

    this.libOpenIMSDK.signaling_invite = this.lib.func(
      '__stdcall',
      'signaling_invite',
      'void',
      ['baseCallback *', 'str', 'str']
    );

    this.libOpenIMSDK.signaling_accept = this.lib.func(
      '__stdcall',
      'signaling_accept',
      'void',
      ['baseCallback *', 'str', 'str']
    );

    this.libOpenIMSDK.signaling_reject = this.lib.func(
      '__stdcall',
      'signaling_reject',
      'void',
      ['baseCallback *', 'str', 'str']
    );

    this.libOpenIMSDK.signaling_cancel = this.lib.func(
      '__stdcall',
      'signaling_cancel',
      'void',
      ['baseCallback *', 'str', 'str']
    );

    this.libOpenIMSDK.signaling_hung_up = this.lib.func(
      '__stdcall',
      'signaling_hung_up',
      'void',
      ['baseCallback *', 'str', 'str']
    );

    this.libOpenIMSDK.signaling_get_room_by_group_id = this.lib.func(
      '__stdcall',
      'signaling_get_room_by_group_id',
      'void',
      ['baseCallback *', 'str', 'str']
    );

    this.libOpenIMSDK.signaling_get_token_by_room_id = this.lib.func(
      '__stdcall',
      'signaling_get_token_by_room_id',
      'void',
      ['baseCallback *', 'str', 'str']
    );

    this.libOpenIMSDK.get_signaling_invitation_info_start_app = this.lib.func(
      '__stdcall',
      'get_signaling_invitation_info_start_app',
      'void',
      ['baseCallback *', 'str']
    );

    this.libOpenIMSDK.signaling_create_meeting = this.lib.func(
      '__stdcall',
      'signaling_create_meeting',
      'void',
      ['baseCallback *', 'str', 'str']
    );

    this.libOpenIMSDK.signaling_join_meeting = this.lib.func(
      '__stdcall',
      'signaling_join_meeting',
      'void',
      ['baseCallback *', 'str', 'str']
    );

    this.libOpenIMSDK.signaling_update_meeting_info = this.lib.func(
      '__stdcall',
      'signaling_update_meeting_info',
      'void',
      ['baseCallback *', 'str', 'str']
    );

    this.libOpenIMSDK.signaling_close_room = this.lib.func(
      '__stdcall',
      'signaling_close_room',
      'void',
      ['baseCallback *', 'str', 'str']
    );

    this.libOpenIMSDK.signaling_get_meetings = this.lib.func(
      '__stdcall',
      'signaling_get_meetings',
      'void',
      ['baseCallback *', 'str']
    );

    this.libOpenIMSDK.signaling_operate_stream = this.lib.func(
      '__stdcall',
      'signaling_operate_stream',
      'void',
      ['baseCallback *', 'str', 'str', 'str', 'str', 'int', 'int']
    );

    this.libOpenIMSDK.signaling_send_custom_signal = this.lib.func(
      '__stdcall',
      'signaling_send_custom_signal',
      'void',
      ['baseCallback *', 'str', 'str', 'str']
    );

    this.libOpenIMSDK.upload_file = this.lib.func(
      '__stdcall',
      'upload_file',
      'void',
      ['baseCallback *', 'str', 'str', 'listenerCallback *']
    );

    Object.assign(this, setupUserModule(this));
    Object.assign(this, setupFriendModule(this));
    Object.assign(this, setupGroupModule(this));
    Object.assign(this, setupConversationModule(this));
    Object.assign(this, setupMessageModule(this));
    Object.assign(this, setupSignalingModule(this));
  }

  generateEventResponse = (data: unknown, operationID = ''): BaseResponse => {
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
      operationID,
    };
  };

  baseCallbackWrap = <T>(
    resolve: (response: BaseResponse<T>) => void,
    reject: (response: BaseResponse<T>) => void
  ) => {
    const registerBaseCallback = koffi.register(
      (operationID: string, errCode: number, errMsg: string, data: string) => {
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
        koffi.unregister(registerBaseCallback);
      },
      koffi.pointer(this.baseCallbackProto)
    );
    return registerBaseCallback;
  };

  sendMessageCallbackWrap = <T>(
    clientMsgID: string,
    resolve: (response: BaseResponse<T>) => void,
    reject: (response: BaseResponse<T>) => void
  ) => {
    const registerSendMessageCallback = koffi.register(
      (
        operationID: string,
        errCode: number,
        errMsg: string,
        data: string,
        progress: number
      ) => {
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
        if (!errCode && !errMsg && !data) {
          // eslint-disable-next-line
          this.emit(
            CbEvents.OnProgress,
            this.generateEventResponse(
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
    this.libOpenIMSDK.set_signaling_listener(this.listenerCallback);
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

  uploadFile = (params: UploadFileParams, opid = uuidV4()) =>
    new Promise<BaseResponse<{ url: string }>>((resolve, reject) => {
      this.libOpenIMSDK.upload_file(
        this.baseCallbackWrap(resolve, reject),
        opid,
        JSON.stringify(params),
        this.listenerCallback
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
  setFriendsEx!: (
    params: SetFriendExParams,
    opid?: string | undefined
  ) => Promise<BaseResponse<void>>;
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
  isJoinGroup!: GroupModuleApi['isJoinGroup'];

  // implements conversation api
  getAllConversationList!: ConversationModuleApi['getAllConversationList'];
  getConversationListSplit!: ConversationModuleApi['getConversationListSplit'];
  getOneConversation!: ConversationModuleApi['getOneConversation'];
  setConversationEx!: (
    params: SetConversationExParams,
    opid?: string | undefined
  ) => Promise<BaseResponse<void>>;
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
  setConversationMsgDestructTime!: ConversationModuleApi['setConversationMsgDestructTime'];
  setConversationIsMsgDestruct!: ConversationModuleApi['setConversationIsMsgDestruct'];

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
  sendGroupMessageReadReceipt!: MessageModuleApi['sendGroupMessageReadReceipt'];
  getGroupMessageReaderList!: MessageModuleApi['getGroupMessageReaderList'];

  // implements signaling api
  signalingInviteInGroup!: SignalingModuleApi['signalingInviteInGroup'];
  signalingInvite!: SignalingModuleApi['signalingInvite'];
  signalingAccept!: SignalingModuleApi['signalingAccept'];
  signalingReject!: SignalingModuleApi['signalingReject'];
  signalingCancel!: SignalingModuleApi['signalingCancel'];
  signalingHungUp!: SignalingModuleApi['signalingHungUp'];
  signalingGetRoomByGroupID!: SignalingModuleApi['signalingGetRoomByGroupID'];
  signalingGetTokenByRoomID!: SignalingModuleApi['signalingGetTokenByRoomID'];
  signalingSendCustomSignal!: SignalingModuleApi['signalingSendCustomSignal'];
  signalingCreateMeeting!: SignalingModuleApi['signalingCreateMeeting'];
  signalingJoinMeeting!: SignalingModuleApi['signalingJoinMeeting'];
  signalingUpdateMeetingInfo!: SignalingModuleApi['signalingUpdateMeetingInfo'];
  signalingCloseRoom!: SignalingModuleApi['signalingCloseRoom'];
  signalingGetMeetings!: SignalingModuleApi['signalingGetMeetings'];
  signalingOperateStream!: SignalingModuleApi['signalingOperateStream'];
}

export default OpenIMSDK;
