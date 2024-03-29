import {readDoc, assert, find, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@see} */
describe(fileNameToDescription(__filename, 'TestSeeClass'), function () {
  const doc = readDoc('class/src/See/Class.js~TestSeeClass.html');

  it('has see from class.', function () {
    find(doc, '.self-detail [data-ice="see"]', (doc)=>{
      assert.includes(doc, 'a[href="http://foo.example.com"]', 'http://foo.example.com');
      assert.includes(doc, 'a[href="http://bar.example.com"]', 'http://bar.example.com');
    });
  });

  it('has see from constructor.', function () {
    findParent(doc, '[id="instance-constructor-constructor"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="see"] a[href="http://example.com"]', 'http://example.com');
    });
  });

  it('has see from member.', function () {
    findParent(doc, '[id="instance-member-p1"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="see"] a[href="http://example.com"]', 'http://example.com');
    });
  });

  it('has see from method.', function () {
    findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, '[data-ice="see"] a[href="http://example.com"]', 'http://example.com');
    });
  });
});
