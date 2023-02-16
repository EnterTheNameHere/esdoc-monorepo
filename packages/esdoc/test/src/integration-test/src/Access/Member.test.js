import { expect } from 'chai';
import {find} from '../../../../util';

describe('test/Access/Member:', function () {
  it('is public', function () {
    const doc = find('longname', 'src/Access/Member.js~TestAccessMember#mPublic');
    expect(doc.access).to.equal('public');
  });

  it('is protected', function () {
    const doc = find('longname', 'src/Access/Member.js~TestAccessMember#mProtected');
    expect(doc.access).to.equal('protected');
  });

  it('is package', function () {
    const doc = find('longname', 'src/Access/Member.js~TestAccessMember#mPackage');
    expect(doc.access).to.equal('package');
  });
  
  it('is private', function () {
    const doc = find('longname', 'src/Access/Member.js~TestAccessMember#mPrivate');
    expect(doc.access).to.equal('private');
  });
});

describe('test/Access/Member/ES2022:', function () {
  it('class private member', function () {
    const doc = find('longname', 'src/Access/Member.js~TestAccessMember#privateField');
    expect(doc.access).to.equal('private');
  });

  it('class static private member', function () {
    const doc = find('longname', 'src/Access/Member.js~TestAccessMember.staticPrivateField');
    expect(doc.access).to.equal('private');
    expect(doc.static).to.equal(true);
  });

  it('class private member with @private JSDOC tag', function () {
    const doc = find('longname', 'src/Access/Member.js~TestAccessMember#privatePrivateField');
    expect(doc.access).to.equal('private');
  });

  it('class static private member with @private JSDOC tag', function () {
    const doc = find('longname', 'src/Access/Member.js~TestAccessMember.privateStaticPrivateField');
    expect(doc.access).to.equal('private');
    expect(doc.static).to.equal(true);
  });

  it('class private member with @public JSDOC tag is still private', function () {
    const doc = find('longname', 'src/Access/Member.js~TestAccessMember#publicPrivateField');
    expect(doc.access).to.equal('private');
  });

  it('class static private member with @public JSDOC tag is still private', function () {
    const doc = find('longname', 'src/Access/Member.js~TestAccessMember.publicStaticPrivateField');
    expect(doc.access).to.equal('private');
    expect(doc.static).to.equal(true);
  });
});
