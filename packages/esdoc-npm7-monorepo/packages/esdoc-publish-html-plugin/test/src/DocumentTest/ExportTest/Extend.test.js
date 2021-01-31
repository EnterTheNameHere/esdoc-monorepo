import {readDoc} from './../../util.js';

/** @test {DocResolver#_resolveNecessary} */
describe('TestExportExtendsInner', function () {
  it('is documented.', function () {
    readDoc('class/src/Export/Extends.js~TestExportExtendsInner.html');
  });
});
