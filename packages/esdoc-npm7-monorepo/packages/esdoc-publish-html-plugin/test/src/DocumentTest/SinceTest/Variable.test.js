import {readDoc, assert, findParent} from './../../util.js';

/** @test {AbstractDoc#@since} */
describe('testSinceVariable', function () {
  const doc = readDoc('variable/index.html');

  describe('in summary', function () {
    it('has since.', function () {
      findParent(doc, '[data-ice="summary"] [href$="#static-variable-testSinceVariable"]', '[data-ice="target"]', (doc)=>{
        assert.includes(doc, '[data-ice="since"]', 'since 1.2.3');
      });
    });
  });

  describe('in detail', function () {
    it('has since.', function () {
      findParent(doc, '[id="static-variable-testSinceVariable"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="since"]', 'since 1.2.3');
      });
    });
  });
});
