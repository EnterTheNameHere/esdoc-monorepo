import {readDoc, assert, fileNameToDescription} from './../../util.js';

/** @test {ClassDoc#@_name} */
describe(fileNameToDescription(__filename, 'TestExportAnonymousClass'), function () {
  const doc = readDoc('class/src/Export/AnonymousClass.js~AnonymousClass.html');

  describe('in self detail', function () {
    it('is named with anonymous.', function () {
      assert.includes(doc, '[data-ice="importPath"]', `import AnonymousClass from 'esdoc-test-fixture/src/Export/AnonymousClass.js'`);
      assert.includes(doc, '.self-detail [data-ice="name"]', 'AnonymousClass');
    });
  });
});
