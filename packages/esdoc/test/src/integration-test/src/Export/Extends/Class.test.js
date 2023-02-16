import assert from 'assert';
import {find} from '../../../../../util';

describe('test/Export/Extends/class', function () {
  it('is not exported that inner class', function () {
    const doc = find('longname', 'src/Export/Extends/Class.js~TestExportExtendsClassInner');
    assert.equal(doc.export, false);
  });

  it('is exported that outer class', function () {
    const doc = find('longname', 'src/Export/Extends/Class.js~TestExportExtendsClass');
    assert.equal(doc.export, true);
  });
});
