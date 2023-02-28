import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@param} */
describe(fileNameToDescription(__filename, 'TestDestructuringArray'), function () {
  const doc = readDoc('class/src/Destructuring/Array.js~TestDestructuringArray.html');

  describe('in summary', function () {
    it('has array destructuring', function () {
      findParent(doc, '[data-ice="summary"] [href$="#instance-method-method1"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, null, 'method1(p: number[])');
      });
    });
  });

  describe('in details', function () {
    it('has array destructuring.', function () {
      findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, 'h3', 'method1(p: number[])');
        assert.includes(doc, 'table.params', 'p number[] this is p.');
        assert.includes(doc, 'table.params', 'p[0] number this is first of p.');
        assert.includes(doc, 'table.params', 'p[1] number this is second of p.');
      });
    });
  });
});
