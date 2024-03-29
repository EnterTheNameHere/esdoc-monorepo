import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {ExternalDoc#@_name} */
describe(fileNameToDescription(__filename, 'TestExternalDefinition'), function () {
  const doc = readDoc('index.html');

  it('has external document.', function () {
    findParent(doc, '[data-ice="nav"] [data-ice="doc"] a[href="http://example.com"]', '[data-ice="doc"]', (doc)=> {
      assert.includes(doc, '[data-ice="name"]', 'TestExternalDefinition');
    });
  });
});
