import {readDoc, assert, find, fileNameToDescription} from './../../util.js';

/** @test {ClassDoc#@extends} */
describe(fileNameToDescription(__filename, 'TestExtendsProperty'), function () {
  const doc = readDoc('class/src/Extends/Property.js~TestExtendsProperty.html');

  it('has extends chain.', function () {
    find(doc, '.self-detail [data-ice="extendsChain"]', (doc)=>{
      assert.includes(doc, null, 'TestExtendsPropertyPackage~obj.TestExtendsPropertyInner → TestExtendsProperty');
    });
  });
});
