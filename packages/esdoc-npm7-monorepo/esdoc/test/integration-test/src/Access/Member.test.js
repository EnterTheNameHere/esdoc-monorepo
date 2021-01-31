import assert from 'assert';
import {find} from '../../util';

describe('test/Access/Member:', function () {
  it('is public', function () {
    const doc = find('longname', 'src/Access/Member.js~TestAccessMember#mPublic');
    assert.equal(doc.access, 'public');
  });

  it('is protected', function () {
    const doc = find('longname', 'src/Access/Member.js~TestAccessMember#mProtected');
    assert.equal(doc.access, 'protected');
  });

  it('is package', function () {
    const doc = find('longname', 'src/Access/Member.js~TestAccessMember#mPackage');
    assert.equal(doc.access, 'package');
  });

  it('is private', function () {
    const doc = find('longname', 'src/Access/Member.js~TestAccessMember#mPrivate');
    assert.equal(doc.access, 'private');
  });
});
