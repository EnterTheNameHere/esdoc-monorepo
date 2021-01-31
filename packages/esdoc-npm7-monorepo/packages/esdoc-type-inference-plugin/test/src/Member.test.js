const assert = require('assert');
const {find} = require('../util');

describe('test/Member.js:', function () {
  it('infer type that is literal', function () {
    const doc = find('longname', 'src/Member.js~TestMember#memberLiteral');
    assert.deepEqual(doc.type, {types: ['number']});
  });

  it('infer type that is array', function () {
    const doc = find('longname', 'src/Member.js~TestMember#memberArray');
    assert.deepEqual(doc.type, {types: ['number[]']});
  });

  it('infer type that is object', function () {
    const doc = find('longname', 'src/Member.js~TestMember#memberObject');
    assert.deepEqual(doc.type, {types: ['{"x1": number, "x2": string}']});
  });

  it('infer type that is template literal', function () {
    const doc = find('longname', 'src/Member.js~TestMember#memberTemplateLiteral');
    assert.deepEqual(doc.type, {types: ['string']});
  });
});
