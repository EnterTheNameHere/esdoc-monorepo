import assert from 'assert';
import {find} from '../../util';

describe('test/Export/ArrowFunction:', function () {
  it('is exported that default export', function () {
    const doc = find('longname', 'src/Export/ArrowFunction.js~ArrowFunction');
    assert.equal(doc.export, true);
  });

  it('is exported that named export', function () {
    const doc = find('longname', 'src/Export/ArrowFunction.js~testExportArrowFunction2');
    assert.equal(doc.export, true);
  });

  it('is not exported that no export', function () {
    const doc = find('longname', 'src/Export/ArrowFunction.js~testExportArrowFunction3');
    assert.equal(doc.export, false);
  });

  it('is exported that indirect', function () {
    const doc = find('longname', 'src/Export/ArrowFunction.js~testExportArrowFunction4');
    assert.equal(doc.export, true);
  });

  it('is exported that multiple named export', function () {
    const doc1 = find('longname', 'src/Export/ArrowFunction.js~testExportArrowFunction5');
    const doc2 = find('longname', 'src/Export/ArrowFunction.js~testExportArrowFunction6');

    assert.equal(doc1.export, true);
    assert.equal(doc2.export, true);
  });
});
