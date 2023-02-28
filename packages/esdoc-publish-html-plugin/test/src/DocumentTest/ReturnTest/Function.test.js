import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {FunctionDoc#@return} */
describe(fileNameToDescription(__filename, 'test return'), function () {
  const doc = readDoc('function/index.html');

  describe('testReturnFunction1', function () {
    describe('in summary', function () {
      it('has return.', function () {
        findParent(doc, '[data-ice="summary"] [href$="#static-function-testReturnFunction1"]', '[data-ice="target"]', (doc)=> {
          assert.includes(doc, null, 'public testReturnFunction1(): TestClassDefinition');
        });
      });
    });

    describe('in details', function () {
      it('has return.', function () {
        findParent(doc, '[id="static-function-testReturnFunction1"]', '[data-ice="detail"]', (doc)=>{
          assert.includes(doc, 'h3', 'public testReturnFunction1(): TestClassDefinition');
          assert.includes(doc, '[data-ice="returnParams"] tbody tr', 'TestClassDefinition this is return value.');
          assert.includes(doc, '[data-ice="returnParams"] tbody tr a', 'class/src/Class/Definition.js~TestClassDefinition.html', 'href');
        });
      });
    });
  });

  describe('testReturnFunction2', function () {
    describe('in summary', function () {
      it('has return.', function () {
        findParent(doc, '[data-ice="summary"] [href$="#static-function-testReturnFunction2"]', '[data-ice="target"]', (doc)=> {
          assert.includes(doc, null, 'public testReturnFunction2(): number');
        });
      });
    });

    describe('in details', function () {
      it('has return.', function () {
        findParent(doc, '[id="static-function-testReturnFunction2"]', '[data-ice="detail"]', (doc)=>{
          assert.includes(doc, 'h3', 'public testReturnFunction2(): number');
          assert.includes(doc, '[data-ice="returnParams"] tbody tr', 'number this is return value.');
        });
      });
    });
  });
});
