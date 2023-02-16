import assert from 'assert';
import {find} from '../../../../../util';

describe('test/Export/IndirectDefault/Function:', function () {
  it('is exported', function () {
    const doc = find('longname', 'src/Export/IndirectDefault/Function.js~testExportIndirectDefaultFunction');
    assert.equal(doc.export, true);
  });
});
