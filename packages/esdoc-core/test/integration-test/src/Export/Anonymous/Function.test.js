import { expect } from 'chai';
import { find } from '../../../../util';

describe('test/Export/Anonymous/function:', function () {
  it('is exported', function () {
    const doc = find('longname', 'src/Export/Anonymous/Function.js~Function');
    expect(doc.export).is.true;
    expect(doc.anonymous).is.true;
    expect(doc.name).equal('Function');
    expect(doc.importStyle).equal('Function');
  });

  it('another anonymous function in other file is exported too', function () {
    const doc = find('longname', 'src/Function.js~Function');
    expect(doc.export).is.true;
    expect(doc.anonymous).is.true;
    expect(doc.name).equal('Function');
    expect(doc.importStyle).equal('Function');
  });
});
