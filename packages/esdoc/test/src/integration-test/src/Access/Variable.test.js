import assert from 'assert';
import {find} from '../../../../util';

describe('test/Access/Variable:', function () {
  it('is public', function () {
    const doc = find('longname', 'src/Access/Variable.js~testAccessVariablePublic');
    assert.equal(doc.access, 'public');
  });

  it('is protected', function () {
    const doc = find('longname', 'src/Access/Variable.js~testAccessVariableProtected');
    assert.equal(doc.access, 'protected');
  });

  it('is package', function () {
    const doc = find('longname', 'src/Access/Variable.js~testAccessVariablePackage');
    assert.equal(doc.access, 'package');
  });

  it('is private', function () {
    const doc = find('longname', 'src/Access/Variable.js~testAccessVariablePrivate');
    assert.equal(doc.access, 'private');
  });
});
