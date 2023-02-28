import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {DocResolver#_resolveLink} */
describe(fileNameToDescription(__filename, 'testLinkFunction'), function () {
  const doc = readDoc('function/index.html');

  it('has link.', function () {
    findParent(doc, '[id="static-function-testLinkFunction"]', '[data-ice="detail"]', (doc)=> {
      assert.includes(doc, '[data-ice="description"] a[href="class/src/Link/Class.js~TestLinkClass.html"]', 'TestLinkClass');
      assert.includes(doc, '[data-ice="description"] a[href="class/src/Link/Class.js~TestLinkClass.html#instance-member-p1"]', 'TestLinkClass#p1');
      assert.includes(doc, '[data-ice="description"] a[href="class/src/Link/Class.js~TestLinkClass.html#instance-method-method1"]', 'TestLinkClass#method1');
    });
  });
});
