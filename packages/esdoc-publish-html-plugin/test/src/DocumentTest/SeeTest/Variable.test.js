import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@see} */
describe(fileNameToDescription(__filename, 'testSeeVariable'), function () {
  const doc = readDoc('variable/index.html');

  it('has see.', function () {
    findParent(doc, '[id="static-variable-testSeeVariable"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="see"] a[href="http://example.com"]', 'http://example.com');
    });
  });
});
