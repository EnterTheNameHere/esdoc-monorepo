import {readDoc, assert, find, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@deprecated} */
describe(fileNameToDescription(__filename, 'testDeprecatedVariable:'), function () {
  const doc = readDoc('variable/index.html');

  describe('in summary', function () {
    it('has deprecated message.', function () {
      find(doc, '[data-ice="summary"] [href="variable/index.html#static-variable-testDeprecatedVariable"]', (doc)=>{
        doc = doc.parents('[data-ice="target"]');
        assert.includes(doc, '[data-ice="deprecated"]', 'this variable was deprecated.');
      });
    });
  });

  describe('in details', function () {
    it('has deprecated message.', function () {
      find(doc, '[id="static-variable-testDeprecatedVariable"]', (doc)=>{
        doc = doc.parents('[data-ice="detail"]');
        assert.includes(doc, '[data-ice="deprecated"]', 'this variable was deprecated.');
      });
    });
  });
});
