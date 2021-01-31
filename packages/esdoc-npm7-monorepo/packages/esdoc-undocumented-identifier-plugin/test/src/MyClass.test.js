const assert = require('assert');
const {find, file} = require('../util');

describe('test undocumented identifier result:', function () {
  it('does not ignore undocumented identifier.', function () {
    const doc = find('name', 'MyClass1');
    assert.equal(doc.undocument, true);
    assert.equal(doc.ignore, undefined);
  });

  it('ignores documented identifier with @ignore.', function () {
    const doc = find('name', 'MyClass2');
    assert.equal(doc.undocument, undefined);
    assert.equal(doc.ignore, true);
  });
});
