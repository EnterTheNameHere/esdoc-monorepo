import assert from 'assert';
import {find} from '../../util';

describe('test/Version/Version:', function () {
  it('has a version', function () {
    const doc = find('longname', 'src/Version/Version.js~TestVersion');
    assert.deepEqual(doc.version, '1.2.3');
  });
});
