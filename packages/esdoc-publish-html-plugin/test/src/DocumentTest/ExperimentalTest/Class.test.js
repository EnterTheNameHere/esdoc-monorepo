import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@experimental} */
describe(fileNameToDescription(__filename, 'TestExperimentalClass'), function () {
  const doc = readDoc('class/src/Experimental/Class.js~TestExperimentalClass.html');

  describe('in self detail', function () {
    it('has desc.', function () {
      assert.includes(doc, '.self-detail [data-ice="experimental"]', 'this class is experimental. this is experimental');
    });
  });

  describe('in summary', function () {
    it('has desc', function () {
      findParent(doc, '[data-ice="summary"] [href$="#instance-member-p1"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, '[data-ice="experimental"]', 'this member is experimental.');
      });

      findParent(doc, '[data-ice="summary"] [href$="#instance-method-method1"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, '[data-ice="experimental"]', 'this method is experimental.');
      });
    });
  });

  describe('in details', function () {
    it('has desc.', function () {
      findParent(doc, '[id="instance-member-p1"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="experimental"]', 'this member is experimental.');
      });

      findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="experimental"]', 'this method is experimental.');
      });
    });
  });
});
