import {readDoc, assert, findParent} from './../../util.js';

/** @test {AbstractDoc#@version} */
describe('TestVersionClass', function () {
  const doc = readDoc('class/src/Version/Class.js~TestVersionClass.html');

  describe('in self detail', function () {
    it('has version.', function () {
      assert.includes(doc, '.header-notice [data-ice="version"]', '1.2.3');
    });
  });

  describe('in summary', function () {
    it('has version', function () {
      assert.includes(doc, '[data-ice="constructorSummary"] [data-ice="version"]', '1.2.3');

      findParent(doc, '[data-ice="summary"] [href$="#instance-member-p1"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, '[data-ice="version"]', '1.2.3');
      });

      findParent(doc, '[data-ice="summary"] [href$="#instance-method-method1"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, '[data-ice="version"]', '1.2.3');
      });
    });
  });

  describe('in details', function () {
    it('has version', function () {
      findParent(doc, '[id="instance-constructor-constructor"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="version"]', '1.2.3');
      });

      findParent(doc, '[id="instance-member-p1"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="version"]', '1.2.3');
      });

      findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="version"]', '1.2.3');
      });
    });
  });
});
