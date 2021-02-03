import assert from 'assert';
import {find} from '../../../util';

describe('test/_Misc/Exclude:', function () {
  it('not exist', function () {
    const doc = find('longname', 'src[\\|/]_Misc[\\|/]Exclude.js~TestExclude');
    assert.equal(doc, null);
  });
});
