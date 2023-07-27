import { expect } from 'chai';
import {find} from '../../../../util';

describe('test/Access/Method:', function () {
  it('is public', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#methodPublic');
    expect(doc.access).to.equal('public');
  });
  
  it('is protected', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#methodProtected');
    expect(doc.access).to.equal('protected');
  });

  it('is package', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#methodPackage');
    expect(doc.access).to.equal('package');
  });
  
  it('is private', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#methodPrivate');
    expect(doc.access).to.equal('private');
  });
  
  describe('for whitespace between *<--->@tag', function () {
    it('parses correctly even with more than one whitespace before @ (1)', function () {
      const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#moreSpacesBetweenAsteriskAndAtSymbol1');
      expect(doc.access).to.equal('public');
    });
  
    it('parses correctly with even more whitespace before @ (2)', function () {
      const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#moreSpacesBetweenAsteriskAndAtSymbol2');
      expect(doc.access).to.equal('public');
    });
  
    it('parses correctly even with more whitespace before @ (3)', function () {
      const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#moreSpacesBetweenAsteriskAndAtSymbol3');
      expect(doc.access).to.equal('public');
    });
  
    it('parses correctly with more whitespace before @ (4)', function () {
      const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#moreSpacesBetweenAsteriskAndAtSymbol4');
      expect(doc.access).to.equal('public');
    });
  
    it('parses correctly with more whitespace before @ (5)', function () {
      const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#moreSpacesBetweenAsteriskAndAtSymbol5');
      expect(doc.access).to.equal('private');
    });
  
    it('parses correctly with more whitespace before @ (6)', function () {
      const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#moreSpacesBetweenAsteriskAndAtSymbol6');
      expect(doc.access).to.equal('protected');
    });
  
    it('parses correctly even with _no_ whitespace before @', function () {
      const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#noSpacesBetweenAsteriskAndAtSymbol');
      expect(doc.access).to.equal('public');
    });
  });
});

describe('test/Access/Method/ES2022:', function () {
  it('class private method', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#privateMethod');
    expect(doc.access).to.equal('private');
  });

  it('class static private method', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod.staticPrivateMethod');
    expect(doc.access).to.equal('private');
    expect(doc.static).to.equal(true);
  });

  it('class private method with @private JSDOC tag', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#privatePrivateMethod');
    expect(doc.access).to.equal('private');
  });

  it('class static private method with @private JSDOC tag', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod.privateStaticPrivateMethod');
    expect(doc.access).to.equal('private');
    expect(doc.static).to.equal(true);
  });
  
  it('class private method with @public JSDOC tag is still private', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#publicPrivateMethod');
    expect(doc.access).to.equal('private');
  });
  
  it('class static private method with @public JSDOC tag is still private', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod.publicStaticPrivateMethod');
    expect(doc.access).to.equal('private');
    expect(doc.static).to.equal(true);
  });

  it('class async private method', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#asyncPrivateMethod');
    expect(doc.access).to.equal('private');
    expect(doc.async).to.equal(true);
    // check if param is present
    expect(doc.params.length).to.equal(1);
    expect(doc.params[0].types).to.deep.equal(['number']);
    expect(doc.params[0].name).to.equal('param');
    expect(doc.params[0].description).to.equal('with one parameter');
  });
  
  it('class static async private method', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod.asyncStaticPrivateMethod');
    expect(doc.access).to.equal('private');
    expect(doc.static).to.equal(true);
    expect(doc.async).to.equal(true);
  });
  
  it('class private accessor', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#privateAccessor');
    expect(doc.kind).to.equal('get');
    expect(doc.access).to.equal('private');
    expect(doc.return.types).to.deep.equal(['number']);
    expect(doc.return.description).to.equal('It\'s 42');
  });
});
