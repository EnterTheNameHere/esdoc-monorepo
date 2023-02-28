import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@emits} */
describe(fileNameToDescription(__filename, 'testEmitsFunction'), function () {
  const doc = readDoc('function/index.html');

  describe('in details', function () {
    it('has desc.', function () {
      findParent(doc, '[id="static-function-testEmitsFunction"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="emitName"] [href$="TestEmitsFunctionEvent.html"]', 'TestEmitsFunctionEvent');
      });
    });
  });
});
