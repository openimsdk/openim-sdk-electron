import type { IKoffiRegisteredCallback } from 'koffi';

export type NativeEventListenerCallback = IKoffiRegisteredCallback;
export type NativeBaseCallback = IKoffiRegisteredCallback;
export type NativeSendMessageCallback = IKoffiRegisteredCallback;

export interface NativeOpenIMSdk {
  get_sdk_version(): string;
  set_group_listener(cCallback: NativeEventListenerCallback): void;
  set_conversation_listener(cCallback: NativeEventListenerCallback): void;
  set_advanced_msg_listener(cCallback: NativeEventListenerCallback): void;
  set_batch_msg_listener(cCallback: NativeEventListenerCallback): void;
  set_user_listener(cCallback: NativeEventListenerCallback): void;
  set_friend_listener(cCallback: NativeEventListenerCallback): void;
  set_custom_business_listener(cCallback: NativeEventListenerCallback): void;
  init_sdk(
    cCallback: NativeEventListenerCallback,
    operationID: string,
    config: string
  ): number;
  un_init_sdk(operationID: string): void;
  login(
    cCallback: NativeBaseCallback,
    operationID: string,
    uid: string,
    token: string
  ): void;
  logout(cCallback: NativeBaseCallback, operationID: string): void;
  set_app_background_status(
    cCallback: NativeBaseCallback,
    operationID: string,
    isBackground: number
  ): void;
  network_status_changed(
    cCallback: NativeBaseCallback,
    operationID: string
  ): void;
  get_login_status(operationID: string): number;
  create_text_message(operationID: string, text: string): string;
  create_advanced_text_message(
    operationID: string,
    text: string,
    messageEntityList: string
  ): string;
  create_text_at_message(
    operationID: string,
    text: string,
    atUserList: string,
    atUsersInfo: string,
    message: string
  ): string;
  create_location_message(
    operationID: string,
    description: string,
    longitude: number,
    latitude: number
  ): string;
  create_custom_message(
    operationID: string,
    data: string,
    extension: string,
    description: string
  ): string;
  create_quote_message(
    operationID: string,
    text: string,
    message: string
  ): string;
  create_advanced_quote_message(
    operationID: string,
    text: string,
    message: string,
    messageEntityList: string
  ): string;
  create_card_message(operationID: string, cardInfo: string): string;
  create_video_message_from_full_path(
    operationID: string,
    videoFullPath: string,
    videoType: string,
    duration: number,
    snapshotFullPath: string
  ): string;
  create_image_message_from_full_path(
    operationID: string,
    imageFullPath: string
  ): string;
  create_sound_message_from_full_path(
    operationID: string,
    soundPath: string,
    duration: number
  ): string;
  create_file_message_from_full_path(
    operationID: string,
    fileFullPath: string,
    fileName: string
  ): string;
  create_image_message(operationID: string, imagePath: string): string;
  create_image_message_by_url(
    operationID: string,
    sourcePath: string,
    sourcePicture: string,
    bigPicture: string,
    snapshotPicture: string
  ): string;
  create_sound_message_by_url(
    operationID: string,
    soundBaseInfo: string
  ): string;
  create_sound_message(
    operationID: string,
    soundPath: string,
    duration: number
  ): string;
  create_video_message_by_url(
    operationID: string,
    videoBaseInfo: string
  ): string;
  create_video_message(
    operationID: string,
    videoPath: string,
    videoType: string,
    duration: number,
    snapshotPath: string
  ): string;
  create_file_message_by_url(operationID: string, fileBaseInfo: string): string;
  create_file_message(
    operationID: string,
    filePath: string,
    fileName: string
  ): string;
  create_merger_message(
    operationID: string,
    messageList: string,
    title: string,
    summaryList: string
  ): string;
  create_face_message(operationID: string, index: number, data: string): string;
  create_forward_message(operationID: string, m: string): string;
  get_all_conversation_list(
    cCallback: NativeBaseCallback,
    operationID: string
  ): void;
  get_conversation_list_split(
    cCallback: NativeBaseCallback,
    operationID: string,
    offset: number,
    count: number
  ): void;
  get_one_conversation(
    cCallback: NativeBaseCallback,
    operationID: string,
    sessionType: number,
    sourceID: string
  ): void;
  get_multiple_conversation(
    cCallback: NativeBaseCallback,
    operationID: string,
    conversationIDList: string
  ): void;
  search_conversation(
    cCallback: NativeBaseCallback,
    operationID: string,
    searchParam: string
  ): void;
  hide_conversation(
    cCallback: NativeBaseCallback,
    operationID: string,
    conversationID: string
  ): void;
  set_conversation_draft(
    cCallback: NativeBaseCallback,
    operationID: string,
    conversationID: string,
    draftText: string
  ): void;
  set_conversation(
    cCallback: NativeBaseCallback,
    operationID: string,
    conversationID: string,
    conversationFields: string
  ): void;
  get_total_unread_msg_count(
    cCallback: NativeBaseCallback,
    operationID: string
  ): void;
  get_at_all_tag(operationID: string): string;
  send_message(
    cCallback: NativeSendMessageCallback,
    operationID: string,
    message: string,
    recvID: string,
    groupID: string,
    offlinePushInfo: string,
    isOnlineOnly: number
  ): void;
  send_message_not_oss(
    cCallback: NativeSendMessageCallback,
    operationID: string,
    message: string,
    recvID: string,
    groupID: string,
    offlinePushInfo: string,
    isOnlineOnly: number
  ): void;
  find_message_list(
    cCallback: NativeBaseCallback,
    operationID: string,
    findMessageOptions: string
  ): void;
  get_advanced_history_message_list(
    cCallback: NativeBaseCallback,
    operationID: string,
    getMessageOptions: string
  ): void;
  get_advanced_history_message_list_reverse(
    cCallback: NativeBaseCallback,
    operationID: string,
    getMessageOptions: string
  ): void;
  revoke_message(
    cCallback: NativeBaseCallback,
    operationID: string,
    conversationID: string,
    clientMsgID: string
  ): void;
  mark_conversation_message_as_read(
    cCallback: NativeBaseCallback,
    operationID: string,
    conversationID: string
  ): void;
  mark_all_conversation_message_as_read(
    cCallback: NativeBaseCallback,
    operationID: string
  ): void;
  delete_message_from_local_storage(
    cCallback: NativeBaseCallback,
    operationID: string,
    conversationID: string,
    clientMsgID: string
  ): void;
  delete_message(
    cCallback: NativeBaseCallback,
    operationID: string,
    conversationID: string,
    clientMsgID: string
  ): void;
  hide_all_conversations(
    cCallback: NativeBaseCallback,
    operationID: string
  ): void;
  change_input_states(
    cCallback: NativeBaseCallback,
    operationID: string,
    conversationID: string,
    focus: number
  ): void;
  get_input_states(
    cCallback: NativeBaseCallback,
    operationID: string,
    conversationID: string,
    userID: string
  ): void;
  delete_all_msg_from_local_and_svr(
    cCallback: NativeBaseCallback,
    operationID: string
  ): void;
  delete_all_msg_from_local(
    cCallback: NativeBaseCallback,
    operationID: string
  ): void;
  clear_conversation_and_delete_all_msg(
    cCallback: NativeBaseCallback,
    operationID: string,
    conversationID: string
  ): void;
  delete_conversation_and_delete_all_msg(
    cCallback: NativeBaseCallback,
    operationID: string,
    conversationID: string
  ): void;
  insert_single_message_to_local_storage(
    cCallback: NativeBaseCallback,
    operationID: string,
    message: string,
    recvID: string,
    sendID: string
  ): void;
  insert_group_message_to_local_storage(
    cCallback: NativeBaseCallback,
    operationID: string,
    message: string,
    groupID: string,
    sendID: string
  ): void;
  search_local_messages(
    cCallback: NativeBaseCallback,
    operationID: string,
    searchParam: string
  ): void;
  set_message_local_ex(
    cCallback: NativeBaseCallback,
    operationID: string,
    conversationID: string,
    clientMsgID: string,
    localEx: string
  ): void;
  get_users_info(
    cCallback: NativeBaseCallback,
    operationID: string,
    userIDs: string
  ): void;
  set_self_info(
    cCallback: NativeBaseCallback,
    operationID: string,
    userInfo: string
  ): void;
  get_self_user_info(cCallback: NativeBaseCallback, operationID: string): void;
  subscribe_users_status(
    cCallback: NativeBaseCallback,
    operationID: string,
    userIDs: string
  ): void;
  unsubscribe_users_status(
    cCallback: NativeBaseCallback,
    operationID: string,
    userIDs: string
  ): void;
  get_subscribe_users_status(
    cCallback: NativeBaseCallback,
    operationID: string
  ): void;
  get_user_status(
    cCallback: NativeBaseCallback,
    operationID: string,
    userIDs: string
  ): void;
  // Friend functions
  get_specified_friends_info(
    cCallback: NativeBaseCallback,
    operationID: string,
    userIDList: string,
    filterBlack?: number
  ): void;
  get_friend_list(
    cCallback: NativeBaseCallback,
    operationID: string,
    filterBlack?: number
  ): void;
  get_friend_list_page(
    cCallback: NativeBaseCallback,
    operationID: string,
    offset: number,
    count: number,
    filterBlack?: number
  ): void;
  search_friends(
    cCallback: NativeBaseCallback,
    operationID: string,
    searchParam: string
  ): void;
  check_friend(
    cCallback: NativeBaseCallback,
    operationID: string,
    userIDList: string
  ): void;
  add_friend(
    cCallback: NativeBaseCallback,
    operationID: string,
    userIDReqMsg: string
  ): void;
  update_friends(
    cCallback: NativeBaseCallback,
    operationID: string,
    friendInfos: string
  ): void;
  delete_friend(
    cCallback: NativeBaseCallback,
    operationID: string,
    friendUserID: string
  ): void;
  get_friend_application_list_as_recipient(
    cCallback: NativeBaseCallback,
    operationID: string,
    param: string
  ): void;
  get_friend_application_list_as_applicant(
    cCallback: NativeBaseCallback,
    operationID: string,
    param: string
  ): void;
  get_friend_application_unhandled_count(
    cCallback: NativeBaseCallback,
    operationID: string,
    param: string
  ): void;
  accept_friend_application(
    cCallback: NativeBaseCallback,
    operationID: string,
    userIDHandleMsg: string
  ): void;
  refuse_friend_application(
    cCallback: NativeBaseCallback,
    operationID: string,
    userIDHandleMsg: string
  ): void;
  add_black(
    cCallback: NativeBaseCallback,
    operationID: string,
    blackUserID: string,
    ex: string
  ): void;
  get_black_list(cCallback: NativeBaseCallback, operationID: string): void;
  remove_black(
    cCallback: NativeBaseCallback,
    operationID: string,
    removeUserID: string
  ): void;
  // Group functions
  create_group(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupReqInfo: string
  ): void;
  join_group(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string,
    cReqMsg: string,
    cJoinSource: number,
    ex: string
  ): void;
  quit_group(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string
  ): void;
  dismiss_group(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string
  ): void;
  change_group_mute(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string,
    cIsMute: number
  ): void;
  change_group_member_mute(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string,
    cUserID: string,
    cMutedSeconds: number
  ): void;
  set_group_member_info(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupMemberInfo: string
  ): void;
  get_joined_group_list(
    cCallback: NativeBaseCallback,
    operationID: string
  ): void;
  get_joined_group_list_page(
    cCallback: NativeBaseCallback,
    operationID: string,
    offset: number,
    count: number
  ): void;
  get_specified_groups_info(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupIDList: string
  ): void;
  search_groups(
    cCallback: NativeBaseCallback,
    operationID: string,
    cSearchParam: string
  ): void;
  set_group_info(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupInfo: string
  ): void;
  get_group_member_list(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string,
    cFilter: number,
    cOffset: number,
    cCount: number
  ): void;
  get_group_member_owner_and_admin(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string
  ): void;
  get_group_member_list_by_join_time_filter(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string,
    cOffset: number,
    cCount: number,
    cJoinTimeBegin: number,
    cJoinTimeEnd: number,
    cFilterUserIDList: string
  ): void;
  get_specified_group_members_info(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string,
    cUserIDList: string
  ): void;
  kick_group_member(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string,
    cReason: string,
    cUserIDList: string
  ): void;
  transfer_group_owner(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string,
    cNewOwnerUserID: string
  ): void;
  invite_user_to_group(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string,
    cReason: string,
    cUserIDList: string
  ): void;
  get_group_application_list_as_recipient(
    cCallback: NativeBaseCallback,
    operationID: string,
    param: string
  ): void;
  get_group_application_list_as_applicant(
    cCallback: NativeBaseCallback,
    operationID: string,
    param: string
  ): void;
  get_group_application_unhandled_count(
    cCallback: NativeBaseCallback,
    operationID: string,
    param: string
  ): void;
  accept_group_application(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string,
    cFromUserID: string,
    cHandleMsg: string
  ): void;
  refuse_group_application(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string,
    cFromUserID: string,
    cHandleMsg: string
  ): void;
  search_group_members(
    cCallback: NativeBaseCallback,
    operationID: string,
    cSearchParam: string
  ): void;
  is_join_group(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string
  ): void;
  get_users_in_group(
    cCallback: NativeBaseCallback,
    operationID: string,
    cGroupID: string,
    userIDList: string
  ): void;
  update_fcm_token(
    cCallback: NativeBaseCallback,
    operationID: string,
    fcmToken: string,
    expireTime: number
  ): void;
  upload_file(
    cCallback: NativeBaseCallback,
    operationID: string,
    cFileInfo: string,
    pCallback: NativeEventListenerCallback
  ): void;
  upload_logs(
    cCallback: NativeBaseCallback,
    operationID: string,
    line: number,
    ex: string,
    pCallback: NativeEventListenerCallback
  ): void;
  logs(
    cCallback: NativeBaseCallback,
    operationID: string,
    logLevel: number,
    file: string,
    line: number,
    msgs: string,
    err: string,
    keyAndValue: string
  ): void;
}
