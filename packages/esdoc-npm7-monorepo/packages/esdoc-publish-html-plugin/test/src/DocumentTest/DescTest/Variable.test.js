import {readDoc, assert, findParent} from './../../util.js';

/** @test {AbstractDoc#@desc} */
describe('testDescVariable', function () {
  const doc = readDoc('variable/index.html');

  describe('in summary', function () {
    it('has desc', function () {
      findParent(doc, '[data-ice="summary"] [href$="#static-variable-testDescVariable"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, '[data-ice="description"]', 'this is testDescVariable.');
      });
    });
  });

  describe('in details', function () {
    it('has desc.', function () {
      findParent(doc, '[id="static-variable-testDescVariable"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="description"]', 'this is testDescVariable.');
      });
    });
  });
});
