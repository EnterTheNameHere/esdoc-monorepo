import {readDoc, assert, find, fileNameToDescription} from './../../util.js';

/** @test {DocBuilder} */
describe(fileNameToDescription(__filename, 'TestAbstractDefinition:'), function () {
  const doc = readDoc('class/src/Abstract/Definition.js~TestAbstractDefinition.html');

  /** @test {DocBuilder#_buildSummaryDoc} */
  it('has abstract method in summary.', function () {
    find(doc, '[data-ice="summary"]', (doc)=> {
      assert.includes(doc, '[data-ice="target"]:nth-of-type(1)', 'public abstract method1() this is abstract method1');
      assert.includes(doc, '[data-ice="target"]:nth-of-type(2)', 'public abstract method2() this is abstract method2');
    });
  });

  /** @test {DocBuilder#_buildDetailDocs} */
  it('has abstract method in detail.', function () {
    assert.includes(doc, '[data-ice="detail"]:nth-of-type(1)', 'public abstract method1()');
    assert.includes(doc, '[data-ice="detail"]:nth-of-type(2)', 'public abstract method2()');
  });
});
