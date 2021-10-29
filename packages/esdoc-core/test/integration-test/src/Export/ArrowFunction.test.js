import { expect } from 'chai';
import { find } from '../../../util';

describe('test/Export/ArrowFunction:', function () {
  it('anonymous arrow function is exported', function () {
    const doc = find('longname', 'src/Export/ArrowFunction.js~ArrowFunction');
    expect(doc.export).is.true;
    expect(doc.anonymous).is.true;
    expect(doc.name).equal('ArrowFunction');
    expect(doc.importStyle).equal('ArrowFunction');
  });

  it('another anonymous arrow function in other file is exported too', function () {
    const doc = find('longname', 'src/ArrowFunction.js~ArrowFunction');
    expect(doc.export).is.true;
    expect(doc.anonymous).is.true;
    expect(doc.name).equal('ArrowFunction');
    expect(doc.importStyle).equal('ArrowFunction');
  });

  it('is exported that named export', function () {
    const doc = find('longname', 'src/Export/ArrowFunction.js~testExportArrowFunction2');
    expect(doc.export).is.true;
  });

  it('is not exported that no export', function () {
    const doc = find('longname', 'src/Export/ArrowFunction.js~testExportArrowFunction3');
    expect(doc.export).is.false;
  });

  it('is exported that indirect', function () {
    const doc = find('longname', 'src/Export/ArrowFunction.js~testExportArrowFunction4');
    expect(doc.export).is.true;
  });

  it('is exported that multiple named export', function () {
    const doc1 = find('longname', 'src/Export/ArrowFunction.js~testExportArrowFunction5');
    const doc2 = find('longname', 'src/Export/ArrowFunction.js~testExportArrowFunction6');

    expect(doc1.export).is.true;
    expect(doc2.export).is.true;
  });
});
