import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@property} */
describe(fileNameToDescription(__filename, 'TestPropertyReturn'), function () {
  const doc = readDoc('class/src/Property/Return.js~TestPropertyReturn.html');

  describe('in details', function () {
    it('has desc.', function () {
      findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="returnProperties"] tbody tr:nth-child(1)', 'x1 number this is x1 of return value.');
        assert.includes(doc, '[data-ice="returnProperties"] tbody tr:nth-child(2)', 'x2 TestClassDefinition this is x2 of return value.');
        assert.includes(doc, '[data-ice="returnProperties"] tbody tr:nth-child(2) a', 'class/src/Class/Definition.js~TestClassDefinition.html', 'href');
      });
    });
  });
});
