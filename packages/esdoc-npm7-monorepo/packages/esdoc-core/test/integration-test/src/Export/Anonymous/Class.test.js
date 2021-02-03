import assert from 'assert';
import {find} from '../../../../util';

describe('test/Export/Anonymous/class:', function () {
  it('is exported', function () {
    const doc = find('longname', 'src/Export/Anonymous/Class.js~Class');
    assert.equal(doc.export, true);
  });
});
