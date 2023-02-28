import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/**
 * @test {ParamParser#parseParamValue}
 * @test {ParamParser#parseParam}
 */
describe(fileNameToDescription(__filename, 'TestTypeClass'), function () {
  const doc = readDoc('class/src/Type/Class.js~TestTypeClass.html');

  it('has class type.', function () {
    findParent(doc, '[data-ice="summary"] [href$="#instance-method-method1"]', '[data-ice="target"]', (doc)=> {
      assert.includes(doc, null, 'method1(p1: TestTypeClassInner)');
      assert.includes(doc, 'a[href="class/src/Type/Class.js~TestTypeClassInner.html"]', 'TestTypeClassInner');
    });
  });
});
