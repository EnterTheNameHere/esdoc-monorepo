import {readDoc, assert, find, fileNameToDescription} from './../../util.js';

/** @test {DocResolver#_resolveIgnore */
describe(fileNameToDescription(__filename, 'testIgnoreFunction'), function () {
  const doc = readDoc('function/index.html');

  it('is not documented.', function () {
    assert.throws(()=> find(doc, '[data-ice="summary"] [href$="#static-function-testIgnoreFunction"]', ()=>{}));
    assert.throws(()=> find(doc, '[id="static-function-testIgnoreFunction"]', ()=>{}));
  });
});
