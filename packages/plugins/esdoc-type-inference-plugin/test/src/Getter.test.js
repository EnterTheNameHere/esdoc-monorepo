const assert = require('assert');
const {find} = require('../util');

describe('test/Getter.js:', function () {
  it('infer type that is literal', function () {
    const doc = find('longname', 'src/Getter.js~TestGetter#getLiteral');
    assert.deepEqual(doc.type, {types: ['number']});
  });

  it('infer type that is array', function () {
    const doc = find('longname', 'src/Getter.js~TestGetter#getArray');
    assert.deepEqual(doc.type, {types: ['number[]']});
  });

  it('infer type that is object', function () {
    const doc = find('longname', 'src/Getter.js~TestGetter#getObject');
    assert.deepEqual(doc.type, {types: ['{"x1": number, "x2": string}']});
  });

  it('infer type that is template literal', function () {
    const doc = find('longname', 'src/Getter.js~TestGetter#getTemplateLiteral');
    assert.deepEqual(doc.type, {types: ['string']});
  });
});
