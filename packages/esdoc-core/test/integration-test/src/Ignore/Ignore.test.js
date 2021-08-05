import assert from 'assert';
import {find} from '../../../util';

describe('test/Ignore/Ignore:', function () {
  it('is ignored', function () {
    const doc = find('longname', 'src/Ignore/Ignore.js~TestIgnoreClass');
    assert.equal(doc.ignore, true);
  });
});
