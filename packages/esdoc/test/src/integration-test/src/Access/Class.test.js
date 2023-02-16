import assert from 'assert';
import {find} from '../../../../util';

describe('test/Access/Class:', function () {
  it('is public', function () {
    const doc = find('longname', 'src/Access/Class.js~TestAccessClassPublic');
    assert.equal(doc.access, 'public');
  });

  it('is protected', function () {
    const doc = find('longname', 'src/Access/Class.js~TestAccessClassProtected');
    assert.equal(doc.access, 'protected');
  });

  it('is package', function () {
    const doc = find('longname', 'src/Access/Class.js~TestAccessClassPackage');
    assert.equal(doc.access, 'package');
  });

  it('is private', function () {
    const doc = find('longname', 'src/Access/Class.js~TestAccessClassPrivate');
    assert.equal(doc.access, 'private');
  });
});
