const assert = require('node:assert/strict');
const path = require('node:path');
const { app } = require('electron');

const libraryPath = path.resolve(process.argv[2] || '');
assert(process.argv[2], 'A native OpenIM library path is required');

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
