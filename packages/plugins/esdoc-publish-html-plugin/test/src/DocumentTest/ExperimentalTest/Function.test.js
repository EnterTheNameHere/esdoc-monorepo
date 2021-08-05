import {readDoc, assert, findParent} from './../../util.js';

/** @test {AbstractDoc#@experimental} */
describe('testExperimentalFunction', function () {
  const doc = readDoc('function/index.html');

  describe('in summary', function () {
    it('has desc', function () {
      findParent(doc, '[data-ice="summary"] [href$="#static-function-testExperimentalFunction"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, '[data-ice="experimental"]', 'this function is experimental.');
      });
    });
  });

  describe('in details', function () {
    it('has desc.', function () {
      findParent(doc, '[id="static-function-testExperimentalFunction"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="experimental"]', 'this function is experimental.');
      });
    });
  });
});
