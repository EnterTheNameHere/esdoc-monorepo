import {readDoc, assert, findParent} from './../../util.js';

/** @test {AbstractDoc#@emits} */
describe('testEmitsFunction', function () {
  const doc = readDoc('function/index.html');

  describe('in details', function () {
    it('has desc.', function () {
      findParent(doc, '[id="static-function-testEmitsFunction"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="emitName"] [href$="TestEmitsFunctionEvent.html"]', 'TestEmitsFunctionEvent');
      });
    });
  });
});
