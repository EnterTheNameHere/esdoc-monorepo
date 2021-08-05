import {readDoc, assert, findParent} from './../../util.js';

/** @test {AbstractDoc#@desc} */
describe('TestDescMultiLine:', function () {
  const doc = readDoc('class/src/Desc/MultiLine.js~TestDescMultiLine.html');

  describe('in summary', function () {
    it('has first sentence desc', function () {
      findParent(doc, '[data-ice="summary"] [href$="#instance-method-method1"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, '[data-ice="description"]', 'this is method1.');
      });

      findParent(doc, '[data-ice="summary"] [href$="#instance-method-method2"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, '[data-ice="description"]', 'this is method2.');
      });

      findParent(doc, '[data-ice="summary"] [href$="#instance-method-method3"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, '[data-ice="description"]', 'this is method3.');
      });
    });
  });

  describe('in details:', function () {
    it('has all sentence desc.', function () {
      findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="description"]', 'this is method1. this is second line.');
      });

      findParent(doc, '[id="instance-method-method2"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="description"]', 'this is method2. this is second sentence.');
      });

      findParent(doc, '[id="instance-method-method3"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="description"]', 'this is method3. this is second sentence.');
      });
    });
  });
});
