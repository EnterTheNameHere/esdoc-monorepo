import {readDoc, assert, fileNameToDescription} from './../../util.js';

/**
 * @test {AbstractDoc#@_export}
 * @test {ClassDocBuilder@_buildClassDoc}
 */
describe(fileNameToDescription(__filename, 'test export class'), function () {
  it('has default import path with direct class definition.', function () {
    const doc = readDoc('class/src/Export/Class.js~TestExportClass1.html');
    assert.includes(doc, '.header-notice [data-ice="importPath"]', "import TestExportClass1 from 'esdoc-test-fixture/src/Export/Class.js'");
  });

  it('has named import path with direct.', function () {
    const doc = readDoc('class/src/Export/Class.js~TestExportClass2.html');
    assert.includes(doc, '.header-notice [data-ice="importPath"]', "import {TestExportClass2} from 'esdoc-test-fixture/src/Export/Class.js'");
  });

  it('has named import path with indirect class definition', function () {
    const doc = readDoc('class/src/Export/Class.js~TestExportClass3.html');
    assert.includes(doc, '.header-notice [data-ice="importPath"]', "import {TestExportClass3} from 'esdoc-test-fixture/src/Export/Class.js'");
  });

  it('has named import path with indirect class expression', function () {
    const doc = readDoc('class/src/Export/Class.js~TestExportClass4.html');
    assert.includes(doc, '.header-notice [data-ice="importPath"]', "import {TestExportClass4} from 'esdoc-test-fixture/src/Export/Class.js'");
  });

  it('has named import path with undocument', function () {
    const doc = readDoc('class/src/Export/Class.js~TestExportClass5.html');
    assert.includes(doc, '.header-notice [data-ice="importPath"]', "import {TestExportClass5} from 'esdoc-test-fixture/src/Export/Class.js'");
  });

  it('is not documented.', function () {
    try {
      readDoc('class/src/Export/Class.js~TestExportClass6.html');
    } catch (e) {
      return;
    }
    assert(false);
  });
});
