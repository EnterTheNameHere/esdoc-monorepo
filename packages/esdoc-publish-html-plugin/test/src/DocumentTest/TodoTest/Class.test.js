import {readDoc, assert, find, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@todo} */
describe(fileNameToDescription(__filename, 'TestTodoClass'), function () {
  const doc = readDoc('class/src/Todo/Class.js~TestTodoClass.html');

  it('has todo at class.', function () {
    find(doc, '.self-detail [data-ice="todo"]', (doc)=>{
      assert.includes(doc, 'li:nth-child(1)', 'this is first todo.');
      assert.includes(doc, 'li:nth-child(2)', 'this is second todo.');
    });
  });

  it('has todo at constructor.', function () {
    findParent(doc, '[id="instance-constructor-constructor"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="todo"]', 'this is todo');
    });
  });

  it('has see from member.', function () {
    findParent(doc, '[id="instance-member-p1"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="todo"]', 'this is todo');
    });
  });

  it('has see from method.', function () {
    findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="todo"]', 'this is todo');
    });
  });
});
