import assert from 'assert';
import {find} from '../../../../util';

describe('test/Access/Function:', function () {
  it('is public', function () {
    const doc = find('longname', 'src/Access/Function.js~testAccessFunctionPublic');
    assert.equal(doc.access, 'public');
  });

  it('is protected', function () {
    const doc = find('longname', 'src/Access/Function.js~testAccessFunctionProtected');
    assert.equal(doc.access, 'protected');
  });

  it('is package', function () {
    const doc = find('longname', 'src/Access/Function.js~testAccessFunctionPackage');
    assert.equal(doc.access, 'package');
  });

  it('is private', function () {
    const doc = find('longname', 'src/Access/Function.js~testAccessFunctionPrivate');
    assert.equal(doc.access, 'private');
  });
});
