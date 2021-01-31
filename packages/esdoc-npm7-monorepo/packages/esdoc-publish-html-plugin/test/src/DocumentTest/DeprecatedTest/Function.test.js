import {readDoc, assert, find} from './../../util.js';

/** @test {AbstractDoc#@deprecated} */
describe('testDeprecatedFunction:', function () {
  const doc = readDoc('function/index.html');

  describe('in summary', function () {
    it('has deprecated message.', function () {
      find(doc, '[data-ice="summary"] [href="function/index.html#static-function-testDeprecatedFunction"]', (doc)=>{
        doc = doc.parents('[data-ice="target"]');
        assert.includes(doc, '[data-ice="deprecated"]', 'this function was deprecated.');
      });
    });
  });

  describe('in details', function () {
    it('has deprecated message of member and method.', function () {
      find(doc, '[id="static-function-testDeprecatedFunction"]', (doc)=>{
        doc = doc.parents('[data-ice="detail"]');
        assert.includes(doc, '[data-ice="deprecated"]', 'this function was deprecated.');
      });
    });
  });
});
