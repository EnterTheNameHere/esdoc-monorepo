import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/**
 * @test {ParamParser#parseParamValue}
 * @test {ParamParser#parseParam}
 */
describe(fileNameToDescription(__filename, 'TestTypeTypedef'), function () {
  const doc = readDoc('class/src/Type/Typedef.js~TestTypeTypedef.html');

  it('has typedef type.', function () {
    findParent(doc, '[data-ice="summary"] [href$="#instance-method-method1"]', '[data-ice="target"]', (doc)=> {
      assert.includes(doc, null, 'method1(p1: TestTypeTypedefInner)');
      assert.multiIncludes(doc, '[data-ice="signature"] a', [
        'typedef/index.html#static-typedef-TestTypeTypedefInner'
      ], 'href');
    });
  });
});
