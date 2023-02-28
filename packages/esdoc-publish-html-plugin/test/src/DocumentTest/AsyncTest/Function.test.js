import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {FunctionDoc#_$async} */
describe(fileNameToDescription(__filename, 'testAsyncFunction'), function () {
  const doc = readDoc('function/index.html');

  describe('in summary', function () {
    it('has async mark', function () {
      findParent(doc, '[data-ice="summary"] [href$="#static-function-testAsyncFunction"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, null, 'public async testAsyncFunction()');
      });
    });
  });

  describe('in details', function () {
    it('has async mark.', function () {
      findParent(doc, '[id="static-function-testAsyncFunction"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, 'h3', 'public async testAsyncFunction()');
      });
    });
  });
});
