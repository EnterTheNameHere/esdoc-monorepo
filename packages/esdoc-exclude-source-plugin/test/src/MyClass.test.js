const assert = require('assert');
const fs = require('fs');

describe('test/MyClass.js:', function () {
  const tmp = fs.readFileSync('./test/out/index.json').toString();
  const docs = JSON.parse(tmp);

  it('does not have source code.', function () {
    docs.forEach((doc) => {
      if (doc.kind === 'file' || doc.kind === 'testFile')  {
        assert.equal(doc.content, '');
      }
    });
  });
});
