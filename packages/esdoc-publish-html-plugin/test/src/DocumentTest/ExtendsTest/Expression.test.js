import {readDoc, assert, find, fileNameToDescription} from './../../util.js';

/** @test {ClassDoc#@extends} */
describe(fileNameToDescription(__filename, 'TestExtendsExpression'), function () {
  const doc = readDoc('class/src/Extends/Expression.js~TestExtendsExpression.html');

  it('has expression extends.', function () {
    find(doc, '.self-detail [data-ice="expressionExtends"]', (doc)=>{
      assert.includes(doc, 'pre code', 'class TestExtendsExpression extends TestExtendsExpressionInner(123)');
    });
  });

  it('has extends chain.', function () {
    find(doc, '.self-detail [data-ice="extendsChain"]', (doc)=>{
      assert.includes(doc, null, 'TestExtendsExpressionInner → TestExtendsExpression');
      assert.includes(doc, 'a[href$="#static-function-TestExtendsExpressionInner"]', 'TestExtendsExpressionInner');
    });
  });
});
