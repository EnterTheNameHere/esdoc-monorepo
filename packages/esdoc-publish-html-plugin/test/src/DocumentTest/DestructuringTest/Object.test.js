import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@param} */
describe(fileNameToDescription(__filename, 'TestDestructuringObject'), function () {
  const doc = readDoc('class/src/Destructuring/Object.js~TestDestructuringObject.html');

  describe('in summary', function () {
    it('has object destructuring', function () {
      findParent(doc, '[data-ice="summary"] [href$="#instance-method-method1"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, null, 'method1(p: Object)');
      });
    });
  });

  describe('in details', function () {
    it('has object destructuring.', function () {
      findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, 'h3', 'method1(p: Object)');
        assert.includes(doc, 'table.params', 'p Object this is object p.');
        assert.includes(doc, 'table.params', 'p.p1 number this is property p1 of p.');
        assert.includes(doc, 'table.params', 'p.p2 string this is property p2 of p.');
      });
    });
  });
});
