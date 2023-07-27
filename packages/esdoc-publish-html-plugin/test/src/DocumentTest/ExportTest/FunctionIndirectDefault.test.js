import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {FunctionDoc#@_name} */
describe(fileNameToDescription(__filename, 'test export function indirect default'), function () {
  const doc = readDoc('function/index.html');
  it('has default import path with indirect function definition', function () {
    findParent(doc, '[id="static-function-testExportFunctionIndirectDefault"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="importPath"]', "import testExportFunctionIndirectDefault from 'esdoc-test-fixture/src/Export/FunctionIndirectDefault.js'");
    });
  });
});
