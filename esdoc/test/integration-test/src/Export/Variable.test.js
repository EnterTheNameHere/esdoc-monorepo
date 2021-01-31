import assert from 'assert';
import {find} from '../../util';

describe('test/Export/Variable:', function () {
  it('is exported that default export', function () {
    const doc = find('longname', 'src/Export/Variable.js~testExportVariable1');
    assert.equal(doc.export, true);
  });

  it('is exported that named export', function () {
    const doc = find('longname', 'src/Export/Variable.js~testExportVariable2');
    assert.equal(doc.export, true);
  });

  it('is not exported that non export', function () {
    const doc = find('longname', 'src/Export/Variable.js~testExportVariable3');
    assert.equal(doc.export, false);
  });

  it('is exported that indirect named export', function () {
    const doc = find('longname', 'src/Export/Variable.js~testExportVariable4');
    assert.equal(doc.export, true);
  });

  it('is exported that multiple named export', function () {
    const [doc1, doc2] = find('longname',
      'src/Export/Variable.js~testExportVariable5',
      'src/Export/Variable.js~testExportVariable6'
    );

    assert.equal(doc1.export, true);
    assert.equal(doc2.export, true);
  });

  describe('array destructuring name export', function () {
    it('is export that first', function () {
      const doc = find('longname', 'src/Export/Variable.js~testExportVariable7');
      assert.equal(doc.export, true);
    });

    it('is export that second', function () {
      const doc = find('longname', 'src/Export/Variable.js~testExportVariable8');
      assert.equal(doc.export, true);
    });
  });

  describe('object destructuring name export', function () {
    it('is export that first', function () {
      const doc = find('longname', 'src/Export/Variable.js~testExportVariable9');
      assert.equal(doc.export, true);
    });

    it('is export that second', function () {
      const doc = find('longname', 'src/Export/Variable.js~testExportVariable10');
      assert.equal(doc.export, true);
    });
  });
});
