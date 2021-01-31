import {readDoc, assert, findParent} from './../../util.js';

/** @test {AbstractDoc#@version} */
describe('testVersionVariable', function () {
  const doc = readDoc('variable/index.html');

  describe('in summary', function () {
    it('has version', function () {
      findParent(doc, '[data-ice="summary"] [href$="#static-variable-testVersionVariable"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, '[data-ice="version"]', '1.2.3');
      });
    });
  });

  describe('in details', function () {
    it('has desc.', function () {
      findParent(doc, '[id="static-variable-testVersionVariable"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="version"]', '1.2.3');
      });
    });
  });
});
