import {readDoc, assert, findParent} from './../../util.js';

/** @test {AbstractDoc#@see} */
describe('testSeeFunction', function () {
  const doc = readDoc('function/index.html');

  it('has see.', function () {
    findParent(doc, '[id="static-function-testSeeFunction"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="see"] a[href="http://example.com"]', 'http://example.com');
    });
  });
});
