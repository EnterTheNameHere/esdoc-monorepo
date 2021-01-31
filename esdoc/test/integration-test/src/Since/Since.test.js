import assert from 'assert';
import {find} from '../../util';

describe('test/Since/Since:', function () {
  it('has a since version', function () {
    const doc = find('longname', 'src/Since/Since.js~TestSince');
    assert.deepEqual(doc.since, '1.2.3');
  });
});
