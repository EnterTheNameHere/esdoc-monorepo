import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/**
 * @test {ParamParser#parseParamValue}
 * @test {ParamParser#parseParam}
 */
describe(fileNameToDescription(__filename, 'TestTypeLiteral'), function () {
  const doc = readDoc('class/src/Type/Literal.js~TestTypeLiteral.html');

  it('has literal type.', function () {
    findParent(doc, '[data-ice="summary"] [href$="#instance-method-method1"]', '[data-ice="target"]', (doc)=> {
      assert.includes(doc, null, 'method1(p1: number, p2: string, p3: boolean)');
      assert.multiIncludes(doc, '[data-ice="signature"] a', [
        'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number',
        'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String',
        'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean'
      ], 'href');
    });
  });
});
