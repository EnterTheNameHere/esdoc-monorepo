import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/**
 * @test {ParamParser#parseParamValue}
 * @test {ParamParser#parseParam}
 */
describe(fileNameToDescription(__filename, 'TestTypeNullable'), function () {
  const doc = readDoc('class/src/Type/Nullable.js~TypeTestNullable.html');

  it('has nullable value.', function () {
    findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '.params [data-ice="property"]:nth-child(1)', 'nullable: true');
      assert.includes(doc, '.params [data-ice="property"]:nth-child(2)', 'nullable: false');
    });
  });
});
