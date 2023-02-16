import assert from 'assert';
import {find} from '../../../../../util';

describe('test/Export/IndirectDefault/Variable:', function () {
  it('is exported', function () {
    const doc = find('longname', 'src/Export/IndirectDefault/Variable.js~testExportIndirectDefaultVariable');
    assert.equal(doc.export, true);
  });
});
