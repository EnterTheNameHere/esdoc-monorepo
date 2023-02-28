import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {DocResolver#_resolveLink} */
describe(fileNameToDescription(__filename, 'TestLinkClass'), function () {
  const doc = readDoc('class/src/Link/Class.js~TestLinkClass.html');

  it('has link from class.', function () {
    assert.includes(doc, '.self-detail [data-ice="description"] a[href="function/index.html#static-function-testLinkFunction"]', 'testLinkFunction');
  });

  it('has link from constructor.', function () {
    findParent(doc, '[id="instance-constructor-constructor"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="description"] a[href="function/index.html#static-function-testLinkFunction"]', 'testLinkFunction');
    });
  });

  it('has link from member.', function () {
    findParent(doc, '[id="instance-member-p1"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="description"] a[href="function/index.html#static-function-testLinkFunction"]', 'testLinkFunction');
    });
  });

  it('has link from method.', function () {
    findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="description"] a[href="function/index.html#static-function-testLinkFunction"]', 'testLinkFunction');
    });
  });
});

/** @test {DocResolver#_resolveLink} */
describe(fileNameToDescription(__filename, 'TestLinkClass3'), function () {
  const doc = readDoc('class/src/Link/Class.js~TestLinkClass3.html');

  it('has link to inherited class method.', function () {
    findParent(doc, '[id="instance-method-method1FooBar"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="description"] a[href="class/src/Link/Class.js~TestLinkClass.html#instance-method-method1"]', 'TestLinkClass2#method1');
    });
  });
});
