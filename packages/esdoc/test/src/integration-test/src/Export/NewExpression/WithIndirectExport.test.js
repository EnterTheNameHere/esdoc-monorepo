import assert from 'assert';
import {find} from '../../../../../util';

describe('test/Export/NewExpression/WithIndirectExport', function () {
  it('is exported', function () {
    const doc = find('longname', 'src/Export/NewExpression/WithIndirectExport.js~testExportNewExpressionIndirect');
    assert.equal(doc.export, true);
  });
});
