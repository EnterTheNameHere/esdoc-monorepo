import {readDoc, assert, find, fileNameToDescription} from './../../util.js';

/** @test {DocBuilder} */
describe(fileNameToDescription(__filename, 'TestAbstractOverrideDefinition:'), function () {
  const doc = readDoc('class/src/Abstract/Override.js~TestAbstractOverride.html');

  /** @test {DocBuilder#_buildOverrideMethod} */
  it('has override description in summary.', function () {
    find(doc, '[data-ice="detail"]:nth-of-type(1)', (doc)=> {
      assert.includes(doc, '[data-ice="override"] a', 'TestAbstractDefinition#method1');
      assert.includes(doc, '[data-ice="override"] a', 'class/src/Abstract/Definition.js~TestAbstractDefinition.html#instance-method-method1', 'href');
    });

    find(doc, '[data-ice="detail"]:nth-of-type(2)', (doc)=> {
      assert.includes(doc, '[data-ice="override"] a', 'TestAbstractDefinition#method2');
      assert.includes(doc, '[data-ice="override"] a', 'class/src/Abstract/Definition.js~TestAbstractDefinition.html#instance-method-method2', 'href');
    });
  });
});
