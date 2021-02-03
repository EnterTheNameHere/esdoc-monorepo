import assert from 'assert';
import {find} from '../../../util';

describe('test/Unknown/Unknown:', function () {
  it('has unknown', function () {
    const doc = find('longname', 'src/Unknown/Unknown.js~TestUnknown');
    assert.deepEqual(doc.unknown, [{tagName: '@foobar', tagValue: 'this is unknown tag.'}]);
  });
});
