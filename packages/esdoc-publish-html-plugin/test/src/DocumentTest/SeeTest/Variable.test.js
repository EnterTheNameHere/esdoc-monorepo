import {readDoc, assert, findParent} from './../../util.js';

/** @test {AbstractDoc#@see} */
describe('testSeeVariable', function () {
  const doc = readDoc('variable/index.html');

  it('has see.', function () {
    findParent(doc, '[id="static-variable-testSeeVariable"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="see"] a[href="http://example.com"]', 'http://example.com');
    });
  });
});
