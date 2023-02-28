import {readDoc, assert, fileNameToDescription} from './../../util.js';

/**
 * @test {AbstractDoc#@_export}
 * @test {ClassDocBuilder@_buildClassDoc}
 */
describe(fileNameToDescription(__filename, 'TestExportDefault'), function () {
  const doc = readDoc('class/src/Export/Default.js~TestExportDefault.html');
  it('has default import path.', function () {
    assert.includes(doc, '.header-notice [data-ice="importPath"]', `import TestExportDefault from 'esdoc-test-fixture/src/Export/Default.js'`);
  });
});
