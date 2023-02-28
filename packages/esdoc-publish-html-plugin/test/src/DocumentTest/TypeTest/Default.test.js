import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/**
 * @test {ParamParser#parseParamValue}
 * @test {ParamParser#parseParam}
 */
describe(fileNameToDescription(__filename, 'TestTypeDefault'), function () {
  const doc = readDoc('class/src/Type/Default.js~TestTypeDefault.html');

  it('has default value.', function () {
    findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '.params [data-ice="property"]:nth-child(1)', 'optional default: 123');
      assert.includes(doc, '.params [data-ice="property"]:nth-child(2)', 'optional default: []');
    });
  });

  it('has default value of object.', function () {
    findParent(doc, '[id="instance-method-method2"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '.params [data-ice="property"]:nth-child(1)', 'optional default: new Foo()');
    });
  });
});
