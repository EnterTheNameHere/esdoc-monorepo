import {readDoc, assert, findParent} from './../../util.js';

/** @test {AbstractDoc#@since} */
describe('TestSinceClass', function () {
  const doc = readDoc('class/src/Since/Class.js~TestSinceClass.html');

  it('has since at class.', function () {
    assert.includes(doc, '.header-notice [data-ice="since"]', 'since 1.2.3');
  });

  describe('in summary', function () {
    it('has since at constructor.', function () {
      findParent(doc, '[href$="#instance-constructor-constructor"]', '[data-ice="target"]', (doc)=>{
        assert.includes(doc, '[data-ice="since"]', 'since 1.2.3');
      });
    });

    it('has since at member.', function () {
      findParent(doc, '[href$="#instance-member-p1"]', '[data-ice="target"]', (doc)=>{
        assert.includes(doc, '[data-ice="since"]', 'since 1.2.3');
      });
    });

    it('has since at method.', function () {
      findParent(doc, '[href$="#instance-method-method1"]', '[data-ice="target"]', (doc)=>{
        assert.includes(doc, '[data-ice="since"]', 'since 1.2.3');
      });
    });
  });

  describe('in detail', function () {
    it('has since at constructor.', function () {
      findParent(doc, '[id="instance-constructor-constructor"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="since"]', 'since 1.2.3');
      });
    });

    it('has since at member.', function () {
      findParent(doc, '[id="instance-member-p1"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="since"]', 'since 1.2.3');
      });
    });

    it('has since at method.', function () {
      findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, '[data-ice="since"]', 'since 1.2.3');
      });
    });
  });
});
