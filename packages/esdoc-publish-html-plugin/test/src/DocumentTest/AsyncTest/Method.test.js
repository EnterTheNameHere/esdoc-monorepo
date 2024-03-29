import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {MethodDoc#_$async} */
describe(fileNameToDescription(__filename, 'TestAsyncMethod'), function () {
  const doc = readDoc('class/src/Async/Method.js~TestAsyncMethod.html');

  describe('in summary', function () {
    it('has async mark.', function () {
      findParent(doc, '[data-ice="summary"] [href$="#instance-method-method1"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, null, 'public async method1()');
      });
    });
  });

  describe('in details', function () {
    it('has async mark.', function () {
      findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, 'h3', 'public async method1()');
      });
    });
  });
});
