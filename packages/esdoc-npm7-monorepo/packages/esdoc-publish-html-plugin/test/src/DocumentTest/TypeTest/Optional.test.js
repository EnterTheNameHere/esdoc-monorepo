import {readDoc, assert, findParent} from './../../util.js';

/**
 * @test {ParamParser#parseParamValue}
 * @test {ParamParser#parseParam}
 */
describe('TestTypeOptional', function () {
  const doc = readDoc('class/src/Type/Optional.js~TestTypeOptional.html');

  it('has optional attribute.', function () {
    findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '.params [data-ice="property"]:nth-child(1)', 'optional');
    });
  });
});
