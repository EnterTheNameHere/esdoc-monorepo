import assert from 'assert';
import {find} from '../../util';

describe('test/Export/Class:', function () {
  it('is exported that default export', function () {
    const doc = find('longname', 'src/Export/Class.js~TestExportClass1');
    assert.equal(doc.export, true);
  });

  it('is exported that named export', function () {
    const doc = find('longname', 'src/Export/Class.js~TestExportClass2');
    assert.equal(doc.export, true);
  });

  it('is exported that indirect with declaration', function () {
    const doc = find('longname', 'src/Export/Class.js~TestExportClass3');
    assert.equal(doc.export, true);
  });

  it('is exported that indirect with expression', function () {
    const doc = find('longname', 'src/Export/Class.js~TestExportClass4');
    assert.equal(doc.export, true);
  });

  it('is not exported that non export', function () {
    const doc = find('longname', 'src/Export/Class.js~TestExportClass5');
    assert.equal(doc.export, false);
  });

  it('is exported that multiple named export', function () {
    const [doc1, doc2] = find('longname',
      'src/Export/Class.js~TestExportClass6',
      'src/Export/Class.js~TestExportClass7'
    );

    assert.equal(doc1.export, true);
    assert.equal(doc2.export, true);
  });
});
