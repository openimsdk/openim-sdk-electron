// libOpenIMSDK.d.ts
declare module 'libOpenIMSDK' {
  export type CB_S = Buffer | ((data: string) => void);
  export type CB_I_S = Buffer | ((event: number, data: string) => void);
  export type CB_S_I_S_S =
    | Buffer
    | ((
        operationID: string,
        errCode: number,
        errMsg: string,
        data: string
      ) => void);
  export type CB_S_I_S_S_I =
    | Buffer
    | ((
        operationID: string,
        errCode: number,
        errMsg: string,
        data: string,
        progress: number
      ) => void);

  export interface LibOpenIMSDK {
    set_group_listener(cCallback: CB_I_S): void;
    set_conversation_listener(cCallback: CB_I_S): void;
    set_advanced_msg_listener(cCallback: CB_I_S): void;
    set_batch_msg_listener(cCallback: CB_I_S): void;
    set_user_listener(cCallback: CB_I_S): void;
    set_friend_listener(cCallback: CB_I_S): void;
    set_custom_business_listener(cCallback: CB_I_S): void;
    init_sdk(cCallback: CB_I_S, operationID: string, config: string): number;
    un_init_sdk(operationID: string): void;
    login(
      cCallback: CB_S_I_S_S,
      operationID: string,
      uid: string,
      token: string
    ): void;
    logout(cCallback: CB_S_I_S_S, operationID: string): void;
    set_app_background_status(
      cCallback: CB_S_I_S_S,
      operationID: string,
      isBackground: number
    ): void;
    network_status_changed(cCallback: CB_S_I_S_S, operationID: string): void;
    get_login_status(operationID: string): number;
    get_login_user(): string;
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
    create_file_message_by_url(
      operationID: string,
      fileBaseInfo: string
    ): string;
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
    create_face_message(
      operationID: string,
      index: number,
      data: string
    ): string;
    create_forward_message(operationID: string, m: string): string;
    get_all_conversation_list(cCallback: CB_S_I_S_S, operationID: string): void;
    get_conversation_list_split(
      cCallback: CB_S_I_S_S,
      operationID: string,
      offset: number,
      count: number
    ): void;
    get_one_conversation(
      cCallback: CB_S_I_S_S,
      operationID: string,
      sessionType: number,
      sourceID: string
    ): void;
    get_multiple_conversation(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationIDList: string
    ): void;
    set_conversation_msg_destruct_time(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string,
      msgDestructTime: number
    ): void;
    set_conversation_is_msg_destruct(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string,
      isMsgDestruct: number
    ): void;
    hide_conversation(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string
    ): void;
    get_conversation_recv_message_opt(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationIDList: string
    ): void;
    set_conversation_draft(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string,
      draftText: string
    ): void;
    reset_conversation_group_at_type(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string
    ): void;
    pin_conversation(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string,
      isPinned: number
    ): void;
    set_conversation_private_chat(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string,
      isPrivate: number
    ): void;
    set_conversation_burn_duration(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string,
      duration: number
    ): void;
    set_conversation_recv_message_opt(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string,
      opt: number
    ): void;
    get_total_unread_msg_count(
      cCallback: CB_S_I_S_S,
      operationID: string
    ): void;
    get_at_all_tag(operationID: string): string;
    get_conversation_id_by_session_type(
      operationID: string,
      sourceID: string,
      sessionType: number
    ): string;
    send_message(
      cCallback: CB_S_I_S_S_I,
      operationID: string,
      message: string,
      recvID: string,
      groupID: string,
      offlinePushInfo: string
    ): void;
    send_message_not_oss(
      cCallback: CB_S_I_S_S_I,
      operationID: string,
      message: string,
      recvID: string,
      groupID: string,
      offlinePushInfo: string
    ): void;
    find_message_list(
      cCallback: CB_S_I_S_S,
      operationID: string,
      findMessageOptions: string
    ): void;
    get_advanced_history_message_list(
      cCallback: CB_S_I_S_S,
      operationID: string,
      getMessageOptions: string
    ): void;
    get_advanced_history_message_list_reverse(
      cCallback: CB_S_I_S_S,
      operationID: string,
      getMessageOptions: string
    ): void;
    revoke_message(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string,
      clientMsgID: string
    ): void;
    typing_status_update(
      cCallback: CB_S_I_S_S,
      operationID: string,
      recvID: string,
      msgTip: string
    ): void;
    mark_conversation_message_as_read(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string
    ): void;
    delete_message_from_local_storage(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string,
      clientMsgID: string
    ): void;
    delete_message(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string,
      clientMsgID: string
    ): void;
    hide_all_conversations(cCallback: CB_S_I_S_S, operationID: string): void;
    delete_all_msg_from_local_and_svr(
      cCallback: CB_S_I_S_S,
      operationID: string
    ): void;
    delete_all_msg_from_local(cCallback: CB_S_I_S_S, operationID: string): void;
    clear_conversation_and_delete_all_msg(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string
    ): void;
    delete_conversation_and_delete_all_msg(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string
    ): void;
    insert_single_message_to_local_storage(
      cCallback: CB_S_I_S_S,
      operationID: string,
      message: string,
      recvID: string,
      sendID: string
    ): void;
    insert_group_message_to_local_storage(
      cCallback: CB_S_I_S_S,
      operationID: string,
      message: string,
      groupID: string,
      sendID: string
    ): void;
    search_local_messages(
      cCallback: CB_S_I_S_S,
      operationID: string,
      searchParam: string
    ): void;
    set_message_local_ex(
      cCallback: CB_S_I_S_S,
      operationID: string,
      conversationID: string,
      clientMsgID: string,
      localEx: string
    ): void;
    get_users_info(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDs: string
    ): void;
    get_users_info_with_cache(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDs: string,
      groupID: string
    ): void;
    get_users_info_from_srv(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDs: string
    ): void;
    set_self_info(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userInfo: string
    ): void;
    set_global_recv_message_opt(
      cCallback: CB_S_I_S_S,
      operationID: string,
      opt: number
    ): void;
    get_self_user_info(cCallback: CB_S_I_S_S, operationID: string): void;
    update_msg_sender_info(
      cCallback: CB_S_I_S_S,
      operationID: string,
      nickname: string,
      faceURL: string
    ): void;
    subscribe_users_status(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDs: string
    ): void;
    unsubscribe_users_status(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDs: string
    ): void;
    get_subscribe_users_status(
      cCallback: CB_S_I_S_S,
      operationID: string
    ): void;
    get_user_status(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDs: string
    ): void;
    // Friend functions
    get_specified_friends_info(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDList: string
    ): void;
    get_friend_list(cCallback: CB_S_I_S_S, operationID: string): void;
    get_friend_list_page(
      cCallback: CB_S_I_S_S,
      operationID: string,
      offset: number,
      count: number
    ): void;
    search_friends(
      cCallback: CB_S_I_S_S,
      operationID: string,
      searchParam: string
    ): void;
    check_friend(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDList: string
    ): void;
    add_friend(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDReqMsg: string
    ): void;
    set_friend_remark(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDRemark: string
    ): void;
    delete_friend(
      cCallback: CB_S_I_S_S,
      operationID: string,
      friendUserID: string
    ): void;
    get_friend_application_list_as_recipient(
      cCallback: CB_S_I_S_S,
      operationID: string
    ): void;
    get_friend_application_list_as_applicant(
      cCallback: CB_S_I_S_S,
      operationID: string
    ): void;
    accept_friend_application(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDHandleMsg: string
    ): void;
    refuse_friend_application(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDHandleMsg: string
    ): void;
    add_black(
      cCallback: CB_S_I_S_S,
      operationID: string,
      blackUserID: string
    ): void;
    get_black_list(cCallback: CB_S_I_S_S, operationID: string): void;
    remove_black(
      cCallback: CB_S_I_S_S,
      operationID: string,
      removeUserID: string
    ): void;
    // Group functions
    create_group(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupReqInfo: string
    ): void;
    join_group(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cReqMsg: string,
      cJoinSource: number
    ): void;
    quit_group(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string
    ): void;
    dismiss_group(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string
    ): void;
    change_group_mute(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cIsMute: number
    ): void;
    change_group_member_mute(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cUserID: string,
      cMutedSeconds: number
    ): void;
    set_group_member_role_level(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cUserID: string,
      cRoleLevel: number
    ): void;
    set_group_member_info(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupMemberInfo: string
    ): void;
    get_joined_group_list(cCallback: CB_S_I_S_S, operationID: string): void;
    get_specified_groups_info(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupIDList: string
    ): void;
    search_groups(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cSearchParam: string
    ): void;
    set_group_info(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupInfo: string
    ): void;
    set_group_verification(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cVerification: number
    ): void;
    set_group_look_member_info(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cRule: number
    ): void;
    set_group_apply_member_friend(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cRule: number
    ): void;
    get_group_member_list(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cFilter: number,
      cOffset: number,
      cCount: number
    ): void;
    get_group_member_owner_and_admin(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string
    ): void;
    get_group_member_list_by_join_time_filter(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cOffset: number,
      cCount: number,
      cJoinTimeBegin: number,
      cJoinTimeEnd: number,
      cFilterUserIDList: string
    ): void;
    get_specified_group_members_info(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cUserIDList: string
    ): void;
    kick_group_member(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cReason: string,
      cUserIDList: string
    ): void;
    transfer_group_owner(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cNewOwnerUserID: string
    ): void;
    invite_user_to_group(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cReason: string,
      cUserIDList: string
    ): void;
    get_group_application_list_as_recipient(
      cCallback: CB_S_I_S_S,
      operationID: string
    ): void;
    get_group_application_list_as_applicant(
      cCallback: CB_S_I_S_S,
      operationID: string
    ): void;
    accept_group_application(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cFromUserID: string,
      cHandleMsg: string
    ): void;
    refuse_group_application(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cFromUserID: string,
      cHandleMsg: string
    ): void;
    set_group_member_nickname(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string,
      cUserID: string,
      cGroupMemberNickname: string
    ): void;
    search_group_members(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cSearchParam: string
    ): void;
    is_join_group(
      cCallback: CB_S_I_S_S,
      operationID: string,
      cGroupID: string
    ): void;
  }
  const lib: LibOpenIMSDK;
  export default lib;
}
