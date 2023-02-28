import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@experimental} */
describe(fileNameToDescription(__filename, 'testExperimentalVariable'), function () {
  const doc = readDoc('variable/index.html');

  describe('in summary', function () {
    it('has desc', function () {
      findParent(doc, '[data-ice="summary"] [href$="#static-variable-testExperimentalVariable"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, '[data-ice="experimental"]', 'this variable is experimental.');
      });
    });
  });

  describe('in details', function () {
    it('has desc.', function () {
      findParent(doc, '[id="static-variable-testExperimentalVariable"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="experimental"]', 'this variable is experimental.');
      });
    });
  });
});
