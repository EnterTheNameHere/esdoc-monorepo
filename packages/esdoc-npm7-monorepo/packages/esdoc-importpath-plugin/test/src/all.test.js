const assert = require('assert');
const {find} = require('../util');

describe('test/MyClass.js:', function () {

  it('converts simply', function () {
    const doc = find('name', 'MyClass1');
    assert.equal(doc.importPath, 'esdoc-importpath-plugin/lib/MyClass1.js');
  });

  it('converts multiple', function () {
    const doc = find('name', 'MyClass2');
    assert.equal(doc.importPath, 'esdoc-importpath-plugin/lib/foo');
  });

  it('converts with package name', function () {
    const doc = find('name', 'Index');
    assert.equal(doc.importPath, 'esdoc-importpath-plugin');
  });
});
