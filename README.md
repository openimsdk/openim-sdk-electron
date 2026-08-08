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

The package contains CI-built native libraries for `mac_arm64`, `mac_x64`,
`linux_arm64`, `linux_x64`, and `win_x64` under its `assets` directory. The
native library version is checked against the expected SDK Core version at
startup.

## Release process

Electron releases are published only by the GitHub Actions release workflow
after a matching `v*` tag is pushed. Before pushing the Electron tag:

1. Publish the matching `@openim/wasm-client-sdk` version and push its matching
   Git tag.
2. Ensure the `openim-sdk-cpp` `v3.8.3-patch.15` tag contains the reusable
   five-platform native build workflow and the required C ABI exports.
3. Push an Electron tag that exactly matches the version in `package.json`.

Manual workflow runs build and verify the release inputs but never publish to
npm.

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

### In main process

```typescript
import OpenIMSdkMain from '@openim/electron-client-sdk';

const sdk = new OpenIMSdkMain(libPath, mainWindow.webContents);

// Call this when the application tears the SDK down.
sdk.dispose();
```

### In preload script

```typescript
import '@openim/electron-client-sdk/preload';
```

### In renderer process

```typescript
import { getWithRenderProcess } from '@openim/electron-client-sdk/render';

const { instance } = getWithRenderProcess();

export const imSdk = instance;
```

If you need SDK event telemetry in the renderer process, you can pass an
optional callback to receive the raw event payload and build your own sanitized
summary:

```typescript
import { getWithRenderProcess } from '@openim/electron-client-sdk/render';

const { instance } = getWithRenderProcess({
  onSdkEventLog(entry) {
    console.info('openim-sdk-event', entry);
  },
});

export const imSdk = instance;
```

The callback receives the event name, source, and full payload. Do not write the
payload directly to disk logs; consumers should
extract only the fields they need and redact message bodies, drafts, tokens, and
other sensitive values before logging.

### Logging In and Listening for Connection Status

> Note: You need to [deploy](https://github.com/openimsdk/open-im-server#rocket-quick-start) OpenIM Server first, the default port of OpenIM Server is 10001, 10002.

```typescript
import {
  LogLevel,
  Platform,
  SdkEvent,
  type SdkResponse,
} from '@openim/wasm-client-sdk';

imSdk.on(SdkEvent.OnConnecting, handleConnecting);
imSdk.on(SdkEvent.OnConnectFailed, handleConnectFailed);
imSdk.on(SdkEvent.OnConnectSuccess, handleConnectSuccess);

// electron
await imSdk.initSDK({
  platformID: Platform.Windows,
  apiAddr: 'http://your-server-ip:10002',
  wsAddr: 'ws://your-server-ip:10001',
  dataDir: 'your-db-dir',
  logFilePath: 'your-log-file-path',
  logLevel: LogLevel.Debug,
  isLogStandardOutput: true,
});

await imSdk.login({
  userID: 'your-user-id',
  token: 'your-token',
});

// web
await imSdk.login({
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

function handleConnectFailed({ errCode, errMsg }: SdkResponse) {
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
import {
  SdkEvent,
  type MessageItem,
  type SdkResponse,
} from '@openim/wasm-client-sdk';

// Listenfor new messages 📩
imSdk.on(SdkEvent.OnRecvNewMessages, handleNewMessages);

const message = (await imSdk.createTextMessage('hello openim')).data;

imSdk
  .sendMessage({
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

function handleNewMessages({ data }: SdkResponse<MessageItem[]>) {
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

OpenIM SDK Electron is licensed under AGPL-3.0-only. See [LICENSE](./LICENSE) for the full license text.
