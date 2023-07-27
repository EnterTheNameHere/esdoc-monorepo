const assert = require('assert');
const {find} = require('../util');

describe('test unexported identifier result:', function () {

  it('ignores unexported identifier.', function () {
    const doc = find('name', 'MyClass1');
    assert.equal(doc.export, false);
    assert.equal(doc.ignore, true);
  });

  it('ignores exported identifier with @ignore.', function () {
    const doc = find('name', 'MyClass2');
    assert.equal(doc.export, true);
    assert.equal(doc.ignore, true);
  });

  it('does not ignore exported identifier.', function () {
    const doc = find('name', 'MyClass3');
    assert.equal(doc.export, true);
    assert.equal(doc.ignore, undefined);
  });
});
