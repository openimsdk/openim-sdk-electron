import { ipcMain, powerMonitor } from 'electron';
import type { WebContents } from 'electron';
import { SdkEvent } from '@openim/wasm-client-sdk';
import type { SdkResponse } from '@openim/wasm-client-sdk';
import OpenIMSdk from './core';
import {
  OPENIM_SDK_EVENT_CHANNEL,
  OPENIM_SDK_METHOD_CHANNEL,
} from './constant/ipc';

export { OPENIM_SDK_EVENT_CHANNEL, OPENIM_SDK_METHOD_CHANNEL };

export const OPENIM_PUBLIC_SDK_METHODS = [
  'initSDK',
  'login',
  'getLoginStatus',
  'logout',
  'unInitSDK',
  'setAppBackgroundStatus',
  'networkStatusChanged',
  'updateFcmToken',
  'uploadFile',
  'uploadLogs',
  'verboseLogs',
  'debugLogs',
  'infoLogs',
  'warnLogs',
  'errorLogs',
  'fatalLogs',
  'panicLogs',
  'getSelfUserInfo',
  'setSelfInfo',
  'getUsersInfo',
  'subscribeUsersStatus',
  'unsubscribeUsersStatus',
  'getSubscribeUsersStatus',
  'getUserStatus',
  'acceptFriendApplication',
  'addBlack',
  'addFriend',
  'checkFriend',
  'deleteFriend',
  'getBlackList',
  'getFriendApplicationListAsApplicant',
  'getFriendApplicationListAsRecipient',
  'getFriendApplicationUnhandledCount',
  'getFriendList',
  'getFriendListPage',
  'getSpecifiedFriendsInfo',
  'refuseFriendApplication',
  'removeBlack',
  'searchFriends',
  'updateFriends',
  'createGroup',
  'joinGroup',
  'inviteUserToGroup',
  'getJoinedGroupList',
  'getJoinedGroupListPage',
  'searchGroups',
  'getSpecifiedGroupsInfo',
  'setGroupInfo',
  'getGroupApplicationListAsRecipient',
  'getGroupApplicationListAsApplicant',
  'getGroupApplicationUnhandledCount',
  'acceptGroupApplication',
  'refuseGroupApplication',
  'getGroupMemberList',
  'getSpecifiedGroupMembersInfo',
  'searchGroupMembers',
  'setGroupMemberInfo',
  'getGroupMemberOwnerAndAdmin',
  'getGroupMemberListByJoinTimeFilter',
  'kickGroupMember',
  'changeGroupMemberMute',
  'changeGroupMute',
  'transferGroupOwner',
  'dismissGroup',
  'quitGroup',
  'isJoinGroup',
  'getUsersInGroup',
  'getAllConversationList',
  'getConversationListSplit',
  'getOneConversation',
  'getMultipleConversation',
  'searchConversation',
  'getTotalUnreadMsgCount',
  'markConversationMessageAsRead',
  'markAllConversationMessageAsRead',
  'setConversationDraft',
  'setConversation',
  'hideConversation',
  'hideAllConversations',
  'clearConversationAndDeleteAllMsg',
  'deleteConversationAndDeleteAllMsg',
  'changeInputStates',
  'getInputStates',
  'createTextMessage',
  'createAdvancedTextMessage',
  'createAdvancedQuoteMessage',
  'createTextAtMessage',
  'createLocationMessage',
  'createCustomMessage',
  'createQuoteMessage',
  'createCardMessage',
  'createMergerMessage',
  'createFaceMessage',
  'createForwardMessage',
  'createImageMessage',
  'createImageMessageFromFullPath',
  'createImageMessageByURL',
  'createVideoMessage',
  'createVideoMessageFromFullPath',
  'createVideoMessageByURL',
  'createSoundMessage',
  'createSoundMessageFromFullPath',
  'createSoundMessageByURL',
  'createFileMessage',
  'createFileMessageFromFullPath',
  'createFileMessageByURL',
  'getAdvancedHistoryMessageList',
  'getAdvancedHistoryMessageListReverse',
  'sendMessage',
  'sendMessageNotOss',
  'findMessageList',
  'getAtAllTag',
  'revokeMessage',
  'deleteMessageFromLocalStorage',
  'deleteMessage',
  'deleteAllMsgFromLocalAndSvr',
  'deleteAllMsgFromLocal',
  'searchLocalMessages',
  'insertGroupMessageToLocalStorage',
  'insertSingleMessageToLocalStorage',
  'setMessageLocalEx',
] as const;
const PUBLIC_SDK_METHODS = new Set<string>(OPENIM_PUBLIC_SDK_METHODS);

class OpenIMSdkMain {
  private readonly sdk: OpenIMSdk;
  private readonly webContents = new Set<WebContents>();
  private disposed = false;

  constructor(path: string, webContent?: WebContents) {
    this.sdk = new OpenIMSdk(path, this.emitProxy);
    if (webContent) this.addWebContent(webContent);
    powerMonitor.on('suspend', this.handleSuspend);
    powerMonitor.on('resume', this.handleResume);
    ipcMain.handle(OPENIM_SDK_METHOD_CHANNEL, this.handleInvoke);
  }

  private handleSuspend = () => {
    void this.sdk.setAppBackgroundStatus(true).catch(() => undefined);
  };

  private handleResume = () => {
    void this.sdk.setAppBackgroundStatus(false).catch(() => undefined);
  };

  private handleInvoke = async (
    _: unknown,
    method: string,
    ...args: unknown[]
  ): Promise<unknown> => {
    if (!PUBLIC_SDK_METHODS.has(method)) {
      return this.createIpcError(`Unsupported OpenIM SDK method: ${method}`);
    }

    const target = (this.sdk as unknown as Record<string, unknown>)[method];
    if (typeof target !== 'function') {
      return this.createIpcError(`OpenIM SDK method is unavailable: ${method}`);
    }

    try {
      return await target.apply(this.sdk, args);
    } catch (error) {
      if (this.isSdkResponse(error)) return error;
      return this.createIpcError(
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  private emitProxy = (event: SdkEvent, data: unknown) => {
    for (const webContent of this.webContents) {
      if (!webContent.isDestroyed()) {
        webContent.send(OPENIM_SDK_EVENT_CHANNEL, event, data);
      }
    }
  };

  private isSdkResponse(value: unknown): value is SdkResponse {
    return (
      typeof value === 'object' &&
      value !== null &&
      ('errCode' in value || 'errMsg' in value)
    );
  }

  private createIpcError(message: string): SdkResponse<null> {
    return {
      event: '',
      errCode: -1,
      errMsg: message,
      data: null,
      operationID: '',
    };
  }

  public addWebContent(webContent: WebContents) {
    if (this.disposed) throw new Error('OpenIMSdkMain has been disposed');
    this.webContents.add(webContent);
    webContent.once('destroyed', () => this.webContents.delete(webContent));
  }

  public dispose() {
    if (this.disposed) return;
    this.disposed = true;
    ipcMain.removeHandler(OPENIM_SDK_METHOD_CHANNEL);
    powerMonitor.removeListener('suspend', this.handleSuspend);
    powerMonitor.removeListener('resume', this.handleResume);
    this.webContents.clear();
  }
}

export default OpenIMSdkMain;
