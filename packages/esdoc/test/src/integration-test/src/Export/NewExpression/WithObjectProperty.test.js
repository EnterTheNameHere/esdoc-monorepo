import assert from 'assert';
import {find} from '../../../../../util';

describe('test/Export/NewExpression/WithObjectProperty:', function () {
  it('is exported', function () {
    const doc = find('longname', 'src/Export/NewExpression/WithObjectProperty.js~TestExportNewExpressionProperty');
    assert.equal(doc.export, true);
  });
});
