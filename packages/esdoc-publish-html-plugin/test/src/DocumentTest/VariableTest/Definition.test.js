import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {VariableDoc} */
describe(fileNameToDescription(__filename, 'testVariableDefinition'), function () {
  const doc = readDoc('variable/index.html');

  describe('in summary', function () {
    it('has desc', function () {
      findParent(doc, '[data-ice="summary"] [href$="#static-variable-testVariableDefinition"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, null, 'public testVariableDefinition: number');
      });
    });
  });

  describe('in details', function () {
    it('has desc.', function () {
      findParent(doc, '[id="static-variable-testVariableDefinition"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, 'h3', 'public testVariableDefinition: number');
      });
    });
  });
});
