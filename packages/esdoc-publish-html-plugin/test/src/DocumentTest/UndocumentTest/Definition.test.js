import {readDoc, assert, fileNameToDescription} from './../../util.js';

/**
 * @test {DocFactory#_traverseComments}
 * @test {AbstractDoc#@desc}
 * @test {DocResolver#_resolveUndocumentIdentifier}
 */
describe(fileNameToDescription(__filename, 'TestUndocumentDefinition'), function () {
  const doc = readDoc('class/src/Undocument/Definition.js~TestUndocumentDefinition.html');

  it('is exist', function () {
    assert.includes(doc, '.self-detail [data-ice="name"]', 'TestUndocumentDefinition');
  });
});
