import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {VariableDoc#@_name} */
describe(fileNameToDescription(__filename, 'test export variable'), function () {
  const doc = readDoc('variable/index.html');

  it('has default import path with direct variable definition.', function () {
    findParent(doc, '[id="static-variable-testExportVariable1"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="importPath"]', "import testExportVariable1 from 'esdoc-test-fixture/src/Export/Variable.js'");
    });
  });

  it('has named import path with direct variable definition.', function () {
    findParent(doc, '[id="static-variable-testExportVariable2"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="importPath"]', "import {testExportVariable2} from 'esdoc-test-fixture/src/Export/Variable.js'");
    });
  });

  it('is not documented with direct variable definition', function () {
    try {
      findParent(doc, '[id="static-variable-testExportVariable3"]', '[data-ice="detail"]', ()=>{});
    } catch (e) {
      return;
    }
    assert(false);
  });

  it('has named import path with none doc comment', function () {
    findParent(doc, '[id="static-variable-testExportVariable4"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="importPath"]', "import {testExportVariable4} from 'esdoc-test-fixture/src/Export/Variable.js'");
    });

    findParent(doc, '[id="static-variable-testExportVariable5"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="importPath"]', "import {testExportVariable5} from 'esdoc-test-fixture/src/Export/Variable.js'");
    });
  });

  it('has named import path with indirect variable definition.', function () {
    findParent(doc, '[id="static-variable-testExportVariable6"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="importPath"]', "import {testExportVariable6} from 'esdoc-test-fixture/src/Export/Variable.js'");
    });
  });

  it('has named import path with unknown type.', function () {
    findParent(doc, '[id="static-variable-testExportVariable7"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="importPath"]', "import {testExportVariable7} from 'esdoc-test-fixture/src/Export/Variable.js'");
    });
  });
});
