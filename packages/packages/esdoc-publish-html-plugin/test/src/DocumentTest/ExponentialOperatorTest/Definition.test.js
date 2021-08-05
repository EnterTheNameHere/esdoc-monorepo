import {readDoc, assert, findParent} from './../../util.js';

/** @test {ESParser} */
describe('TestExponentiationOperatorDefinition', function () {
  const doc = readDoc('class/src/ExponentiationOperator/Definition.js~TestExponentiationOperatorDefinition.html');

  describe('in self detail', function () {
    it('has desc.', function () {
      assert.includes(doc, '.self-detail [data-ice="description"]', 'this is TestExponentiationOperatorDefinition.');
    });
  });

  describe('in summary', function () {
    it('has desc', function () {
      findParent(doc, '[data-ice="summary"] [href$="#instance-method-method1"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, '[data-ice="description"]', 'this is method1.');
      });
    });
  });

  describe('in details', function () {
    it('has desc.', function () {
      findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="description"]', 'this is method1.');
      });
    });
  });
});
