import {readDoc, assert, find, fileNameToDescription} from './../../util.js';

/**
 * @test {ClassDoc#@extends}
 * @test {DocResolver#_resolveNecessary}
 */
describe(fileNameToDescription(__filename, 'TestExtendsMixin'), function () {
  const doc = readDoc('class/src/Extends/Mixin.js~TestExtendsMixin.html');

  it('has expression extends.', function () {
    find(doc, '.self-detail [data-ice="expressionExtends"]', (doc)=>{
      assert.includes(doc, 'pre code', 'class TestExtendsMixin extends mixin(TestExtendsMixinInner1, TestExtendsMixinInner2)');
    });
  });

  it('has extends chain.', function () {
    find(doc, '.self-detail [data-ice="mixinExtends"]', (doc)=>{
      assert.includes(doc, null, 'TestExtendsMixinInner1, TestExtendsMixinInner2');
      assert.includes(doc, 'a[href="class/src/Extends/Mixin.js~TestExtendsMixinInner1.html"]', 'TestExtendsMixinInner1');
      assert.includes(doc, 'a[href="class/src/Extends/Mixin.js~TestExtendsMixinInner2.html"]', 'TestExtendsMixinInner2');
    });
  });
});
