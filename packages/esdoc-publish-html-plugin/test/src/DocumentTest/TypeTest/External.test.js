import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/**
 * @test {ParamParser#parseParamValue}
 * @test {ParamParser#parseParam}
 */
describe(fileNameToDescription(__filename, 'TestTypeExternal'), function () {
  const doc = readDoc('class/src/Type/External.js~TestTypeExternal.html');

  it('has external type.', function () {
    findParent(doc, '[data-ice="summary"] [href$="#instance-method-method1"]', '[data-ice="target"]', (doc)=> {
      assert.includes(doc, null, 'method1(p1: ArrayBuffer)');
      assert.includes(doc, 'a[href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer"]', 'ArrayBuffer');
    });
  });
});
