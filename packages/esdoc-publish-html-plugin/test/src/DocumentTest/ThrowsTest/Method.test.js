import {readDoc, assert, findParent, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@throws} */
describe(fileNameToDescription(__filename, 'TestThrowsMethod'), function () {
  const doc = readDoc('class/src/Throws/Method.js~TestThrowsMethod.html');

  it('has throws.', function () {
    findParent(doc, '[id="instance-method-method1"]', '[data-ice="detail"]', (doc)=>{
      assert.includes(doc, 'tr[data-ice="throw"]:nth-child(1)', 'TestThrowsMethodError1 throw error if foo.');
      assert.includes(doc, 'tr[data-ice="throw"]:nth-child(1) a', 'class/src/Throws/Method.js~TestThrowsMethodError1.html', 'href');

      assert.includes(doc, 'tr[data-ice="throw"]:nth-child(2)', 'TestThrowsMethodError2 throw error if bar.');
      assert.includes(doc, 'tr[data-ice="throw"]:nth-child(2) a', 'class/src/Throws/Method.js~TestThrowsMethodError2.html', 'href');
    });
  });
});
