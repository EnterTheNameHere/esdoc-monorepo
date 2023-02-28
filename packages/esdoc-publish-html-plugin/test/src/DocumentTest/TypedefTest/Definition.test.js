import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {TypedefDoc} */
describe(fileNameToDescription(__filename, 'TestTypedefDefinition'), function () {
  const doc = readDoc('typedef/index.html');

  describe('in summary', function () {
    it('has desc', function () {
      findParent(doc, '[data-ice="summary"] [href$="#static-typedef-TestTypedefDefinition"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, null, 'public TestTypedefDefinition: Object');
      });
    });
  });

  describe('in details', function () {
    it('has desc.', function () {
      findParent(doc, '[id="static-typedef-TestTypedefDefinition"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, 'h3', 'public TestTypedefDefinition: Object');
        assert.includes(doc, '.params [data-ice="property"]:nth-child(1)', 'p1 number this is p1.');
      });
    });
  });
});
