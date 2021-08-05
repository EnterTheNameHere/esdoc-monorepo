import {readDoc, assert, findParent} from './../../util.js';

/** @test {ESParser} */
describe('TestTrailingCommaDefinition', function () {
  const doc = readDoc('class/src/TrailingComma/Definition.js~TestTrailingCommaDefinition.html');

  describe('in self detail', function () {
    it('has desc.', function () {
      assert.includes(doc, '.self-detail [data-ice="description"]', 'this is TestTrailingCommaDefinition.');
    });
  });

  describe('in summary', function () {
    it('has desc', function () {
      findParent(doc, '[data-ice="summary"] [href$="#instance-method-method1"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, null, 'public method1(p1: number, p2: string)');
      });

      findParent(doc, '[data-ice="summary"] [href$="#instance-method-method2"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, null, 'public method2()');
      });
    });
  });

  describe('in details', function () {
    it('has desc.', function () {
      findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '.params [data-ice="property"]:nth-of-type(1)', 'p1 number this is p1.');
        assert.includes(doc, '.params [data-ice="property"]:nth-of-type(2)', 'p2 string this is p2.');
      });

      findParent(doc, '[id="instance-method-method2"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="description"]', 'this is method2.');
      });
    });
  });
});
