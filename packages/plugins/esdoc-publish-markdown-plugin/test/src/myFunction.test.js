const assert = require('assert');
const {hasLine} = require('../util');

describe('test/myFunction.js:', function () {
  it('has function', function () {
    assert(hasLine('## `myFunction(p1: number): string`'));
    assert(hasLine('this is myFunction'));
  });

  it('has param', function () {
    assert(hasLine('| p1 | number |  | this is p1. |'));
  });
});
