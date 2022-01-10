import assert from 'assert';
import {find} from '../../../util';

describe('test/Access/Method:', function () {
  it('is public', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#methodPublic');
    assert.equal(doc.access, 'public');
  });

  it('is protected', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#methodProtected');
    assert.equal(doc.access, 'protected');
  });

  it('is package', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#methodPackage');
    assert.equal(doc.access, 'package');
  });
  
  it('is private', function () {
    const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#methodPrivate');
    assert.equal(doc.access, 'private');
  });
  
  describe('for whitespace between *<--->@tag', function () {
    it('parses correctly even with more than one whitespace before @ (1)', function () {
      const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#moreSpacesBetweenAsteriskAndAtSymbol1');
      assert.equal(doc.access, 'public');
    });
  
    it('parses correctly with even more whitespace before @ (2)', function () {
      const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#moreSpacesBetweenAsteriskAndAtSymbol2');
      assert.equal(doc.access, 'public');
    });
  
    it('parses correctly even with more whitespace before @ (3)', function () {
      const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#moreSpacesBetweenAsteriskAndAtSymbol3');
      assert.equal(doc.access, 'public');
    });
  
    it('parses correctly with more whitespace before @ (4)', function () {
      const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#moreSpacesBetweenAsteriskAndAtSymbol4');
      assert.equal(doc.access, 'public');
    });
  
    it('parses correctly with more whitespace before @ (5)', function () {
      const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#moreSpacesBetweenAsteriskAndAtSymbol5');
      assert.equal(doc.access, 'private');
    });
  
    it('parses correctly with more whitespace before @ (6)', function () {
      const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#moreSpacesBetweenAsteriskAndAtSymbol6');
      assert.equal(doc.access, 'protected');
    });
  
    it('parses correctly even with _no_ whitespace before @', function () {
      const doc = find('longname', 'src/Access/Method.js~TestAccessMethod#noSpacesBetweenAsteriskAndAtSymbol');
      assert.equal(doc.access, 'public');
    });
  });
});
