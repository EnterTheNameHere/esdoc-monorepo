import {readDoc, assert, findParent} from './../../util.js';

/** @test {AbstractDoc#@listens} */
describe('testListensFunction', function () {
  const doc = readDoc('function/index.html');

  it('has listens.', function () {
    findParent(doc, '[id="static-function-testListensFunction"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="listen"] a[href="class/src/Listens/Function.js~TestListensFunctionEvent.html"]', 'TestListensFunctionEvent');
    });
  });
});
