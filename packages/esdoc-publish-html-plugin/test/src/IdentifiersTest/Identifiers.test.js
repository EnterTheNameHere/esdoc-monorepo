import {readDoc, assert, findParent, fileNameToDescription} from './../util.js';

/** @test {IdentifiersDocBuilder} */
describe(fileNameToDescription(__filename, 'test identifiers'), function () {
  const doc = readDoc('identifiers.html');

  it('has Abstract summary.', function () {
    findParent(doc, '#abstract', '[data-ice="dirSummaryWrap"]', (doc)=>{
      assert.includes(doc, '[data-ice="dirSummary"] [data-ice="target"]:nth-of-type(1)', 'public C TestAbstractDefinition');
    });
  });

  it('has Version summary.', function () {
    findParent(doc, '#version', '[data-ice="dirSummaryWrap"]', (doc)=>{
      assert.includes(doc, '[data-ice="dirSummary"] [data-ice="target"]:nth-of-type(1)', 'public C TestVersionClass');
    });
  });
});
