import {readDoc, assert, fileNameToDescription} from './../../util.js';

/**
 * @test {AbstractDoc#@_export}
 * @test {ClassDocBuilder@_buildClassDoc}
 */
describe(fileNameToDescription(__filename, 'TestExportNamed'), function () {
  it('has named import path.', function () {
    const doc = readDoc('class/src/Export/Named.js~TestExportNamed.html');
    assert.includes(doc, '.header-notice [data-ice="importPath"]', `import {TestExportNamed} from 'esdoc-test-fixture/src/Export/Named.js'`);
  });
});
