import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@example} */
describe(fileNameToDescription(__filename, 'testExampleFunction'), function () {
  const doc = readDoc('function/index.html');

// TODO: It's hard to test against a code transformed with highlighter. Think of something...
//  describe('in details', function () {
//    it('has desc.', function () {
//      findParent(doc, '[id="static-function-testExampleFunction"]', '[data-ice="detail"]', (doc)=>{
//        assert.includes(doc, '[data-ice="exampleDoc"]', 'const foo = 123;');
//      });
//    });
//  });
});
