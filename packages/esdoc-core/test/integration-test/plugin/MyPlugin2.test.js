import assert from 'assert';

describe('test/plugin/MyPlugin2:', function () {
  it('calls handlers', function () {
    const callInfo = require('./MyPlugin2').callInfo;
    assert.deepEqual(callInfo.handlerNames, {
      onStart: true,
      onHandleConfig: true,
      onHandleCode: true,
      onHandleCodeParser: true,
      onHandleAST: true,
      onHandleDocs: true,
      onPublish: true,
      onHandleContent: true,
      onComplete: true
    });
  });
});
