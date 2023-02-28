import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@listens} */
describe(fileNameToDescription(__filename, 'testListensFunction'), function () {
  const doc = readDoc('function/index.html');

  it('has listens.', function () {
    findParent(doc, '[id="static-function-testListensFunction"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="listen"] a[href="class/src/Listens/Function.js~TestListensFunctionEvent.html"]', 'TestListensFunctionEvent');
    });
  });
});
