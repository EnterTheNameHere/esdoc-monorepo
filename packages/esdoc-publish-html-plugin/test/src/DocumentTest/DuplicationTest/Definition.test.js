import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {DocResolver#_resolveDuplication} */
describe(fileNameToDescription(__filename, 'TestDuplicationDefinition'), function () {
  const doc = readDoc('class/src/Duplication/Definition.js~TestDuplicationDefinition.html');

  describe('in summary', function () {
    it('has setter/getter/method.', function () {
      findParent(doc, '[data-ice="summary"] [href$="#instance-set-value"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, null, 'public set value: number');
      });

      findParent(doc, '[data-ice="summary"] [href$="#instance-get-value"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, null, 'public get value: number');
      });

      findParent(doc, '[data-ice="summary"] [href$="#instance-method-onClick"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, null, 'public onClick(p: number)');
      });
    });
  });

  describe('in details', function () {
    it('has setter/getter/method.', function () {
      findParent(doc, '[id="instance-set-value"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, null, 'public set value: number');
      });

      findParent(doc, '[id="instance-get-value"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, null, 'public get value: number');
      });

      findParent(doc, '[id="instance-method-onClick"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, null, 'public onClick(p: number)');
      });
    });
  });
});
