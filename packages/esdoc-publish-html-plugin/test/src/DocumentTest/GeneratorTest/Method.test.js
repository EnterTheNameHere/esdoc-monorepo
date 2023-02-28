import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@_generator} */
describe(fileNameToDescription(__filename, 'TestGeneratorMethod'), function () {
  const doc = readDoc('class/src/Generator/Method.js~TestGeneratorMethod.html');

  describe('in summary', function () {
    it('has generator mark.', function () {
      findParent(doc, '[data-ice="summary"] [href$="#instance-method-method1"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, null, 'public * method1()');
      });
    });
  });

  describe('in details', function () {
    it('has generator mark.', function () {
      findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, 'h3', 'public * method1()');
      });
    });
  });
});
