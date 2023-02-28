import {readDoc, assert, find, fileNameToDescription} from './../../util.js';

/** @test {DocResolver#_resolveIgnore */
describe(fileNameToDescription(__filename, 'test ignore class'), function () {
  describe('TestIgnoreClass1', function () {
    it('is not documented.', function () {
      assert.throws(()=> readDoc('class/src/Ignore/Class.js~TestIgnoreClass1.html'));
    });
  });

  describe('TestIgnoreClass2', function () {
    const doc = readDoc('class/src/Ignore/Class.js~TestIgnoreClass2.html');

    it('does not have ignored member.', function () {
      assert.throws(()=> find(doc, '[data-ice="summary"] [href$="#instance-member-p1"]', ()=>{}));
      assert.throws(()=> find(doc, '[id="instance-member-p1"]', ()=>{}));
    });

    it('does not have ignored method.', function () {
      assert.throws(()=> find(doc, '[data-ice="summary"] [href$="#instance-method-method1"]', ()=>{}));
      assert.throws(()=> find(doc, '[id="instance-method-method1"]', ()=>{}));
    });
  });
});
