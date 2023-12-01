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
      userID: string,
      token: string
    ): void;
    logout(cCallback: CB_S_I_S_S, operationID: string): void;
    network_status_changed(cCallback: CB_S_I_S_S, operationID: string): void;
    get_login_status(operationID: string): number;
    get_login_user(): string;

    // message related functions
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
    get_advanced_history_message_list(
      cCallback: CB_S_I_S_S,
      operationID: string,
      getMessageOptions: string
    ): void;
    send_message(
      cCallback: CB_S_I_S_S_I,
      operationID: string,
      message: string,
      recvID: string,
      groupID: string,
      offlinePushInfo: string
    ): void;

    // Conversation related functions
    get_all_conversation_list(cCallback: CB_S_I_S_S, operationID: string): void;

    // User related functions
    get_users_info(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDList: string
    ): void;
    set_self_info(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userInfo: string
    ): void;
    get_self_user_info(cCallback: CB_S_I_S_S, operationID: string): void;
    subscribe_users_status(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDList: string
    ): void;
    unsubscribe_users_status(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDList: string
    ): void;
    get_subscribe_users_status(
      cCallback: CB_S_I_S_S,
      operationID: string
    ): void;
    get_user_status(
      cCallback: CB_S_I_S_S,
      operationID: string,
      userIDList: string
    ): void;

    // Friend related functions
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

    // Group related functions
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
