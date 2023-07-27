const assert = require('assert');
const fs = require('fs');

describe('test/results.js:', function () {
  const tmp = fs.readFileSync('./test/out/lint.json').toString();
  const lintResults = JSON.parse(tmp);

  it('has 5 lint errors.', function () {
    assert.equal(lintResults.length, 5);
    assert.equal(lintResults[0].name, 'arrowFunction2');
    assert.equal(lintResults[1].name, 'MyClass#method1');
    assert.equal(lintResults[2].name, 'MyClass#method2');
    assert.equal(lintResults[3].name, 'MyClass#method3');
    assert.equal(lintResults[4].name, 'MyClass#method4');
  });
});
