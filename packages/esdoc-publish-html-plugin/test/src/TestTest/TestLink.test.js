import {readDoc, assert, findParent, fileNameToDescription} from './../util.js';

/** @test {ClassDocBuilder} */
describe(fileNameToDescription(__filename, 'test link of test'), function () {
  const doc = readDoc('class/src/Desc/Class.js~TestDescClass.html');
  
  it('has link of test at class', function () {
    assert.multiIncludes(doc, '.self-detail [data-ice="test"] a', [
      'Use describe style mocha interface',
      'Use suite style mocha interface'
    ]);

    assert.multiIncludes(doc, '.self-detail [data-ice="test"] a', [
      'test-file/test/Desc.test.js.html#lineNumber2',
      'test-file/test/Desc.test.js.html#lineNumber23'
    ], 'href');
  });

  it('has link of test at constructor', function () {
    findParent(doc, '#instance-constructor-constructor', '[data-ice="detail"]', (doc)=>{
      assert.multiIncludes(doc, '[data-ice="test"] a', [
        'Use describe style mocha interface Use it style mocha interface',
        'Use suite style mocha interface Use test style mocha interface'
      ]);

      assert.multiIncludes(doc, '[data-ice="test"] a', [
        'test-file/test/Desc.test.js.html#lineNumber4',
        'test-file/test/Desc.test.js.html#lineNumber25',
      ], 'href');
    });
  });

  it('has link of test at member', function () {
    findParent(doc, '#instance-member-p1', '[data-ice="detail"]', (doc)=>{
      assert.multiIncludes(doc, '[data-ice="test"] a', [
        'Use describe style mocha interface Nested describe',
        'Use suite style mocha interface Nested suite'
      ]);

      assert.multiIncludes(doc, '[data-ice="test"] a', [
        'test-file/test/Desc.test.js.html#lineNumber8',
        'test-file/test/Desc.test.js.html#lineNumber29'
      ], 'href');
    });
  });

  it('has link of test at method', function () {
    findParent(doc, '#instance-method-method1', '[data-ice="detail"]', (doc)=>{
      assert.multiIncludes(doc, '[data-ice="test"] a', [
        'Use describe style mocha interface Use context style mocha interface',
        'Use suite style mocha interface Nested suite Nested test'
      ]);

      assert.multiIncludes(doc, '[data-ice="test"] a', [
        'test-file/test/Desc.test.js.html#lineNumber15',
        'test-file/test/Desc.test.js.html#lineNumber31'
      ], 'href');
    });
  });
});
