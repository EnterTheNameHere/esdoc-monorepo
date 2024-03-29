import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@todo} */
describe(fileNameToDescription(__filename, 'testTodoVariable'), function () {
  const doc = readDoc('variable/index.html');

  it('has see.', function () {
    findParent(doc, '[id="static-variable-testTodoVariable"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="todo"]', 'this is todo.');
    });
  });
});
