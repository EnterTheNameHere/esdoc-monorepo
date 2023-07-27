const assert = require('assert');
const fs = require('fs');
const {find} = require('../util');

describe('test/MyClass.js:', function () {
  it('has external Node.js.', function () {
    const doc = find('name', 'http~ClientRequest');
    assert.equal(doc.externalLink, 'https://nodejs.org/dist/latest/docs/api/http.html#http_class_http_clientrequest');
  });

  it('removed external-nodejs.js', function () {
    assert.throws(()=>{
      fs.readFileSync('./test/src/.external-nodejs.js');
    });
  });
});
