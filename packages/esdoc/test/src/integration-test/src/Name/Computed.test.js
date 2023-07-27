import assert from 'assert';
import {find} from '../../../../util';

describe('test/Name/Computed:', function () {
  it('has member computed name', function () {
    const doc = find('longname', 'src/Name/Computed.js~TestNameComputed#[foo.bar]');
    assert(doc);
  });

  it('has method computed name', function () {
    const doc = find('longname', 'src/Name/Computed.js~TestNameComputed#[foo.baz]');
    assert(doc);
  });
});
