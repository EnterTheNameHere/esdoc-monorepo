const assert = require('assert');
const {find} = require('../util');

describe('test/Return.js:', function () {
  it('infer return value that is literal', function () {
    const doc = find('longname', 'src/Return.js~TestReturn#methodLiteral');
    assert.deepEqual(doc.return, {types: ['number']});
  });

  it('infer return value that is array', function () {
    const doc = find('longname', 'src/Return.js~TestReturn#methodArray');
    assert.deepEqual(doc.return, {types: ['number[]']});
  });

  it('infer return value that is object', function () {
    const doc = find('longname', 'src/Return.js~TestReturn#methodObject');
    assert.deepEqual(doc.return, {types: ['{"x1": number, "x2": string}']});
  });

  it('infer return value that is template literal', function () {
    const doc = find('longname', 'src/Return.js~TestReturn#methodTemplateLiteral');
    assert.deepEqual(doc.return, {types: ['string']});
  });

  it('infer return value of object with spreads as object', function () {
    const doc = find('longname', 'src/Return.js~TestReturn#methodObjectWithSpread');
    assert.deepEqual(doc.return, {types: ['{"...spread1": *, "...spread2": *}']});
  });
});
