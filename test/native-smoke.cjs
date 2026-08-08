const assert = require('node:assert/strict');
const path = require('node:path');
const { app } = require('electron');

const libraryArgument = process.argv[process.argv.length - 1];
assert(
  libraryArgument && path.resolve(libraryArgument) !== __filename,
  'A native OpenIM library path is required'
);
const libraryPath = path.resolve(libraryArgument);

app
  .whenReady()
  .then(async () => {
    const exported = require('../lib/index.js');
    const OpenIMSdkMain = exported.default ?? exported;
    const sdk = new OpenIMSdkMain(libraryPath);
    sdk.dispose();
    console.log(`[electron-native-smoke] loaded ${libraryPath}`);
    await app.quit();
  })
  .catch(error => {
    console.error(error);
    app.exit(1);
  });
