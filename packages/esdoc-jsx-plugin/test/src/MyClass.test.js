const assert = require('assert');
const {find} = require('../util');

describe('test/MyClass.js:', function () {
  it('can parse jsx', function () {
    const doc = find('longname', 'src/MyClass.js~MyClass#method');
    assert(doc);
  });
});
