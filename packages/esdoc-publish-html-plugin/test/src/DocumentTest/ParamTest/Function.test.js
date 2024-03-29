import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {FunctionDoc#@param} */
describe(fileNameToDescription(__filename, 'testParamFunction'), function () {
  const doc = readDoc('function/index.html');

  describe('in summary', function () {
    it('has param.', function () {
      findParent(doc, '[data-ice="summary"] [href$="#static-function-testParamFunction"]', '[data-ice="target"]', (doc)=> {
        assert.includes(doc, null, 'public testParamFunction(p1: number, p2: TestClassDefinition)');
      });
    });
  });

  describe('in details', function () {
    it('has param.', function () {
      findParent(doc, '[id="static-function-testParamFunction"]', '[data-ice="detail"]', (doc)=>{
        assert.includes(doc, 'h3', 'public testParamFunction(p1: number, p2: TestClassDefinition)');
        assert.includes(doc, '.params tbody tr:nth-child(1)', 'p1 number this is p1.');
        assert.includes(doc, '.params tbody tr:nth-child(2)', 'p2 TestClassDefinition this is p2.');
        assert.includes(doc, '.params tbody tr:nth-child(2) a', 'class/src/Class/Definition.js~TestClassDefinition.html', 'href');
      });
    });
  });
});
