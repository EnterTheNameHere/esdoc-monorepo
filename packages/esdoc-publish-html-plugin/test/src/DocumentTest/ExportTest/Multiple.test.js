import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {DocFactory#_inspectExportNamedDeclaration} */
describe(fileNameToDescription(__filename, 'test multiple export'), function () {
  it('is documented.', function () {
    const doc1 = readDoc('class/src/Export/Multiple.js~TestExportMultiple.html');
    assert.includes(doc1, '.header-notice [data-ice="importPath"]', "import {TestExportMultiple} from 'esdoc-test-fixture/src/Export/Multiple.js'");

    const doc2 = readDoc('variable/index.html');
    findParent(doc2, '[id="static-variable-testExportMultiple"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="importPath"]', "import {testExportMultiple} from 'esdoc-test-fixture/src/Export/Multiple.js'");
    });
  });
});
