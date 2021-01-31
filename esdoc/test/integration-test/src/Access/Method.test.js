import assert from 'assert';
import {find} from '../../util';

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
});
