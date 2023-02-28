import {readDoc, fileNameToDescription} from './../../util.js';

/** @test {DocResolver#_resolveNecessary} */
describe(fileNameToDescription(__filename, 'TestExportExtendsInner'), function () {
  it('is documented.', function () {
    readDoc('class/src/Export/Extends.js~TestExportExtendsInner.html');
  });
});
