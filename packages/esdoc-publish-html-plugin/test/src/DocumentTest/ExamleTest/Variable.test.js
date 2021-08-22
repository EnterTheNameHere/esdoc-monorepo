import {readDoc, assert, findParent} from './../../util.js';

/** @test {AbstractDoc#@example} */
describe('testDescVariable', function () {
  const doc = readDoc('variable/index.html');

// TODO: It's hard to test against a code transformed with highlighter. Think of something...
//  describe('in details', function () {
//    it('has desc.', function () {
//      findParent(doc, '[id="static-variable-testExampleVariable"]', '[data-ice="detail"]', (doc)=>{
//        assert.includes(doc, '[data-ice="exampleDoc"]', 'const foo = 123;');
//      });
//    });
//  });
});
