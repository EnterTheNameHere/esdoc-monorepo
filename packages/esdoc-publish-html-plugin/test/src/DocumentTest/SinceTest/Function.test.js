import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@since} */
describe(fileNameToDescription(__filename, 'testSinceFunction'), function () {
  const doc = readDoc('function/index.html');

  describe('in summary', function () {
    it('has since.', function () {
      findParent(doc, '[data-ice="summary"] [href$="#static-function-testSinceFunction"]', '[data-ice="target"]', (doc)=>{
        assert.includes(doc, '[data-ice="since"]', 'since 1.2.3');
      });
    });
  });

  describe('in detail', function () {
    it('has since.', function () {
      findParent(doc, '[id="static-function-testSinceFunction"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="since"]', 'since 1.2.3');
      });
    });
  });
});
