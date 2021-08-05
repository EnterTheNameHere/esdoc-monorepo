import {readDoc, assert, findParent} from './../../util.js';

/** @test {AbstractDoc#@_generator} */
describe('testGeneratorFunction', function () {
  const doc = readDoc('function/index.html');

  describe('in summary', function () {
    it('has generator mark', function () {
      findParent(doc, '[data-ice="summary"] [href$="#static-function-testGeneratorFunction"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, null, 'public * testGeneratorFunction()');
      });
    });
  });

  describe('in details', function () {
    it('has generator mark.', function () {
      findParent(doc, '[id="static-function-testGeneratorFunction"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, 'h3', 'public * testGeneratorFunction()');
      });
    });
  });
});
