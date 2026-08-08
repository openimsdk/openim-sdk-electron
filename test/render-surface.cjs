const assert = require('node:assert/strict');

const { getWithRenderProcess } = require('../lib/render.cjs.js');
global.window = {};
const { instance } = getWithRenderProcess({
  invoke: async () => ({
    event: '',
    errCode: 0,
    errMsg: '',
    data: undefined,
    operationID: '',
  }),
});

for (const method of [
  'createImageMessageByFile',
  'createVideoMessageByFile',
  'createSoundMessageByFile',
  'createFileMessageByFile',
  'fileMapSet',
  'exportDB',
  'markMessagesAsReadByMsgID',
]) {
  assert.equal(instance[method], undefined, `${method} must not be exposed`);
}
assert.equal(typeof instance.login, 'function');

console.log('[electron-render-surface] unsupported methods are not exposed');
