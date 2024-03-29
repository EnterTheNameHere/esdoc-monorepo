import {readDoc, assert, find, fileNameToDescription} from './../../util.js';

/** @test {DocResolver#_resolveIgnore */
describe(fileNameToDescription(__filename, 'testIgnoreVariable'), function () {
  const doc = readDoc('variable/index.html');

  it('is not documented.', function () {
    assert.throws(()=> find(doc, '[data-ice="summary"] [href$="#static-variable-testIgnoreVariable"]', ()=>{}));
    assert.throws(()=> find(doc, '[id="static-variable-testIgnoreVariable"]', ()=>{}));
  });
});
