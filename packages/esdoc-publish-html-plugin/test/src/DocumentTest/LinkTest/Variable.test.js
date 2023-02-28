import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {DocResolver#_resolveLink} */
describe(fileNameToDescription(__filename, 'testLinkVariable'), function () {
  const doc = readDoc('variable/index.html');

  it('has link.', function () {
    findParent(doc, '[id="static-variable-testLinkVariable"]', '[data-ice="detail"]', (doc)=> {
      assert.includes(doc, '[data-ice="description"] a[href="class/src/Link/Class.js~TestLinkClass.html"]', 'TestLinkClass');
    });
  });
});
