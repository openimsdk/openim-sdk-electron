# Electron Client SDK for OpenIM 👨‍💻💬

Use this SDK to add instant messaging capabilities to your application. By connecting to a self-hosted [OpenIM](https://www.openim.online/) server, you can quickly integrate instant messaging capabilities into your app with just a few lines of code.

The underlying SDK core is implemented in [OpenIM SDK Core](https://github.com/openimsdk/openim-sdk-core). Using cgo, it is exported as C interfaces and provided as dynamic libraries such as DLL, SO, and DYLIB for use by other languages, implemented in [OpenIM SDK Cpp](https://github.com/openimsdk/openim-sdk-cpp.git).The electron interacts with the [OpenIM SDK Cpp](https://github.com/openimsdk/openim-sdk-cpp.git) through JSON, using FFI (Foreign Function Interface) to communicate with the C interfaces, and the SDK exposes a re-encapsulated API for easy usage. For data storage, it utilizes the SQLite layer that is provided internally by the [OpenIM SDK Core](https://github.com/openimsdk/openim-sdk-core).

## Documentation 📚

Visit [https://docs.openim.io/](https://docs.openim.io/) for detailed documentation and guides.

For the SDK reference, see [https://docs.openim.io/sdks/quickstart/electron](https://docs.openim.io/sdks/quickstart/electron).

## Installation 💻

### Adding Dependencies

```shell
npm install @openim/wasm-client-sdk @openim/electron-client-sdk --save
```

### Obtaining Required Static Resources for WASM

Follow these steps to obtain the static resources required for WebAssembly (WASM):

1. Locate the `@openim/wasm-client-sdk` subdirectory in the `node_modules` directory of your project. Copy all the files in the `assets` folder to your project's public resource directory.

   The files to be copied are:

   - `openIM.wasm`
   - `sql-wasm.wasm`
   - `wasm_exec.js`

2. After copying the files, import the `wasm_exec.js` file in your `index.html` file using a `<script>` tag.

### Possible Issues ❗

> if you are using webpack4, you may flow this issue [How to import @openim/wasm-client-sdk in webpack4.x](https://github.com/openimsdk/open-im-sdk-web-wasm/issues/73).

## Usage 🚀

The following examples demonstrate how to use the SDK. TypeScript is used, providing complete type hints.

### Importing the SDK

## In main process

```typescript
import OpenIMSDKMain from '@openim/electron-client-sdk';

...
new OpenIMSDKMain(libPath, mainWindow.webContents);
...
```

## In preload script

```typescript
import '@openim/electron-client-sdk/lib/preload';
```

## In renderer process

```typescript
import { getWithRenderProcess } from '@openim/electron-client-sdk/lib/render';

const { instance } = getWithRenderProcess();

export const IMSDK = instance;
```

### Logging In and Listening for Connection Status

> Note: You need to [deploy](https://github.com/openimsdk/open-im-server#rocket-quick-start) OpenIM Server first, the default port of OpenIM Server is 10001, 10002.

```typescript
import { CbEvents, LogLevel } from '@openim/wasm-client-sdk';
import type { WSEvent } from '@openim/wasm-client-sdk/lib/types/entity';

IMSDK.on(CbEvents.OnConnecting, handleConnecting);
IMSDK.on(CbEvents.OnConnectFailed, handleConnectFailed);
IMSDK.on(CbEvents.OnConnectSuccess, handleConnectSuccess);

// electron
await IMSDK.initSDK({
  platformID: 'your-platform-id',
  apiAddr: 'http://your-server-ip:10002',
  wsAddr: 'ws://your-server-ip:10001',
  dataDir: 'your-db-dir',
  logFilePath: 'your-log-file-path',
  logLevel: LogLevel.Debug,
  isLogStandardOutput: true,
});

await IMSDK.login({
  userID: 'your-user-id',
  token: 'your-token',
});

// web
await IMSDK.login({
  userID: 'your-user-id',
  token: 'your-token',
  platformID: 5,
  apiAddr: 'http://your-server-ip:10002',
  wsAddr: 'ws://your-server-ip:10001',
  logLevel: LogLevel.Debug,
});

function handleConnecting() {
  // Connecting...
}

function handleConnectFailed({ errCode, errMsg }: WSEvent) {
  // Connection failed ❌
  console.log(errCode, errMsg);
}

function handleConnectSuccess() {
  // Connection successful ✅
}
```

To log into the IM server, you need to create an account and obtain a user ID and token. Refer to the [access token documentation](https://docs.openim.io/restapi/userManagement/userRegister) for details.

### Receiving and Sending Messages 💬

OpenIM makes it easy to send and receive messages. By default, there is no restriction on having a friend relationship to send messages (although you can configure other policies on the server). If you know the user ID of the recipient, you can conveniently send a message to them.

```typescript
import { CbEvents } from '@openim/wasm-client-sdk';
import type {
  WSEvent,
  MessageItem,
} from '@openim/wasm-client-sdk/lib/types/entity';

// Listenfor new messages 📩
IMSDK.on(CbEvents.OnRecvNewMessages, handleNewMessages);

const message = (await IMSDK.createTextMessage('hello openim')).data;

IMSDK.sendMessage({
  recvID: 'recv user id',
  groupID: '',
  message,
})
  .then(() => {
    // Message sent successfully ✉️
  })
  .catch(err => {
    // Failed to send message ❌
    console.log(err);
  });

function handleNewMessages({ data }: WSEvent<MessageItem[]>) {
  // New message list 📨
  console.log(data);
}
```

## Examples 🌟

You can find a demo web app that uses the SDK in the [openim-pc-web-demo](https://github.com/openimsdk/open-im-pc-web-demo) repository.

## Community :busts_in_silhouette:

- 📚 [OpenIM Community](https://github.com/OpenIMSDK/community)
- 💕 [OpenIM Interest Group](https://github.com/Openim-sigs)
- 🚀 [Join our Slack community](https://join.slack.com/t/openimsdk/shared_invite/zt-2ijy1ys1f-O0aEDCr7ExRZ7mwsHAVg9A)
- :eyes: [Join our wechat (微信群)](https://openim-1253691595.cos.ap-nanjing.myqcloud.com/WechatIMG20.jpeg)

## Community Meetings :calendar:

We want anyone to get involved in our community and contributing code, we offer gifts and rewards, and we welcome you to join us every Thursday night.

Our conference is in the [OpenIM Slack](https://join.slack.com/t/openimsdk/shared_invite/zt-2ijy1ys1f-O0aEDCr7ExRZ7mwsHAVg9A) 🎯, then you can search the Open-IM-Server pipeline to join

We take notes of each [biweekly meeting](https://github.com/orgs/OpenIMSDK/discussions/categories/meeting) in [GitHub discussions](https://github.com/openimsdk/open-im-server/discussions/categories/meeting), Our historical meeting notes, as well as replays of the meetings are available at [Google Docs :bookmark_tabs:](https://docs.google.com/document/d/1nx8MDpuG74NASx081JcCpxPgDITNTpIIos0DS6Vr9GU/edit?usp=sharing).

## Who are using OpenIM :eyes:

Check out our [user case studies](https://github.com/OpenIMSDK/community/blob/main/ADOPTERS.md) page for a list of the project users. Don't hesitate to leave a [📝comment](https://github.com/openimsdk/open-im-server/issues/379) and share your use case.

## License :page_facing_up:

This software is licensed under a dual-license model:

- The GNU Affero General Public License (AGPL), Version 3 or later; **OR**
- Commercial license terms from OpenIMSDK.

If you wish to use this software under commercial terms, please contact us at: contact@openim.io

For more information, see: https://www.openim.io/en/licensing



