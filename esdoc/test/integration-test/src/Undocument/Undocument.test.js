import assert from 'assert';
import {find} from '../../util';

describe('test/Undocument/Undocument:', function () {
  it('has undocument', function () {
    const doc = find('longname', 'src/Undocument/Undocument.js~TestUndocument');
    assert.deepEqual(doc.undocument, true);
  });
});
