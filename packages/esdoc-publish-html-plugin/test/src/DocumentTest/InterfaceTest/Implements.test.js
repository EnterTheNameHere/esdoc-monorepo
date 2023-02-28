import {readDoc, assert, find, fileNameToDescription} from './../../util.js';

/** @test {ClassDoc#@implements} */
describe(fileNameToDescription(__filename, 'TestInterfaceImplements'), function () {
  const doc = readDoc('class/src/Interface/Implements.js~TestInterfaceImplements.html');

  it('has implements.', function () {
    find(doc, '.self-detail [data-ice="implements"]', (doc)=>{
      assert.includes(doc, 'ul', 'TestInterfaceDefinition, TestInterfaceImplementsInner');
      assert.includes(doc, 'ul a[href="class/src/Interface/Definition.js~TestInterfaceDefinition.html"]', 'TestInterfaceDefinition');
      assert.includes(doc, 'ul a[href="class/src/Interface/Implements.js~TestInterfaceImplementsInner.html"]', 'TestInterfaceImplementsInner');
    });
  });
});
