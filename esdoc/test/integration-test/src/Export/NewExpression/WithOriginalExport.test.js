import assert from 'assert';
import {find} from '../../../util';

describe('test/Export/NewExpression/WithOriginalExport', function () {
  it('is exported', function () {
    const doc = find('longname', 'src/Export/NewExpression/WithOriginalExport.js~TestExportNewExpressionWithOriginalExported');
    assert.equal(doc.export, true);
  });
});
