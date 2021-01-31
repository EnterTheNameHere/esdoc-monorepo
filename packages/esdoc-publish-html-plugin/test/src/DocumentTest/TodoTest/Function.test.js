import {readDoc, assert, findParent} from './../../util.js';

/** @test {AbstractDoc#@todo} */
describe('testTodoFunction', function () {
  const doc = readDoc('function/index.html');

  it('has todo.', function () {
    findParent(doc, '[id="static-function-testTodoFunction"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="todo"]', 'this is todo.');
    });
  });
});
