import {readDoc, assert, find, findParent, fileNameToDescription} from './../../util.js';

/** @test {ClassDoc#@extends} */
describe(fileNameToDescription(__filename, 'TestExtendsOuter'), function () {
  const doc = readDoc('class/src/Extends/Outer.js~TestExtendsOuter.html');

  it('has extends chain.', function () {
    find(doc, '.self-detail [data-ice="extendsChain"]', (doc)=>{
      assert.includes(doc, null, 'Array → TestExtendsBuiltin → TestExtendsOuter');
      assert.includes(doc, 'a[href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"]', 'Array');
      assert.includes(doc, 'a[href="class/src/Extends/Builtin.js~TestExtendsBuiltin.html"]', 'TestExtendsBuiltin');
    });
  });

  it('has inherited methods and more', function () {
    it('has super class methods and more.', function () {
      findParent(doc, '[data-ice="inheritedSummary"] a[href$="TestExtendsBuiltin.html"]', '[data-ice="summary"]', (doc)=>{
        assert.includes(doc, 'thead', 'From class TestExtendsBuiltin');
        assert.includes(doc, 'thead a', 'class/src/Extends/Builtin.js~TestExtendsBuiltin.html', 'href');
        assert.includes(doc, 'a[href$="#instance-method-method1"]', 'method1');
      });
    });
  });
});
