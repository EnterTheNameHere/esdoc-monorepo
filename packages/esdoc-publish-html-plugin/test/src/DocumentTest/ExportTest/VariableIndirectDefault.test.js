import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {VariableDoc#@_name} */
describe(fileNameToDescription(__filename, 'test export variable indirect default'), function () {
  const doc = readDoc('variable/index.html');

  it('has default import path with indirect variable definition.', function () {
    findParent(doc, '[id="static-variable-testExportVariableIndirectDefault"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="importPath"]', "import testExportVariableIndirectDefault from 'esdoc-test-fixture/src/Export/VariableIndirectDefault.js'");
    });
  });
});
