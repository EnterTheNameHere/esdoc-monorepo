import { expect } from 'chai';
import { find } from '../../../../util';

describe('test/Export/Anonymous/class:', function () {
  it('is exported', function () {
    const doc = find('longname', 'src/Export/Anonymous/Class.js~Class');
    expect(doc.export).is.true;
    expect(doc.anonymous).is.true;
    expect(doc.name).equal('Class');
    expect(doc.importStyle).equal('Class');
  });

  it('another anonymous class in other file is exported too', function () {
    const doc = find('longname', 'src/Class.js~Class');
    expect(doc.export).is.true;
    expect(doc.anonymous).is.true;
    expect(doc.name).equal('Class');
    expect(doc.importStyle).equal('Class');
  });
});
