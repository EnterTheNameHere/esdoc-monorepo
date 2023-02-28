import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@throws} */
describe(fileNameToDescription(__filename, 'testThrowsFunction'), function () {
  const doc = readDoc('function/index.html');

  it('has throws.', function () {
    findParent(doc, '[id="static-function-testThrowsFunction"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="throw"] a[href="class/src/Throws/Function.js~TestThrowsFunctionError.html"]', 'TestThrowsFunctionError');
    });
  });
});
