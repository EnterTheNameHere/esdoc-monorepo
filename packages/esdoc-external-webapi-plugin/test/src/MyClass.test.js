const assert = require('assert');
const {find} = require('../util');
const fse = require('fs-extra');

describe('test/MyClass.js:', function () {

  it('has external web api.', function () {
    const doc = find('name', 'XMLHttpRequest');
    assert.equal(doc.externalLink, 'https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest');
  });

  it('removed external-webapi.js', function () {
    assert.throws(()=>{
      fse.readFileSync('./test/src/.external-webapi.js');
    });
  });
});
