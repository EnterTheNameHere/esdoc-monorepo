const { expect } = require('chai');
const {find} = require('../util');

describe('test/MyClass.js:', function () {
  it('has default access', function () {
    const doc = find('longname', 'src/MyClass.js~MyClass#method1');
    expect(doc.access).to.equal('public');
    expect(doc.ignore).to.equal(undefined);
  });

  it('has public access', function () {
    const doc = find('longname', 'src/MyClass.js~MyClass#method2');
    expect(doc.access).to.equal('public');
    expect(doc.ignore).to.equal(undefined);
  });

  it('has protected access', function () {
    const doc = find('longname', 'src/MyClass.js~MyClass#method3');
    expect(doc.access).to.equal('protected');
    expect(doc.ignore).to.equal(undefined);
  });

  it('has private access and is ignored', function () {
    const doc = find('longname', 'src/MyClass.js~MyClass#method4');
    expect(doc.access).to.equal('private');
    expect(doc.ignore).to.equal(true);
  });

  it('has auto private access and is ignored', function () {
    const doc = find('longname', 'src/MyClass.js~MyClass#_method5');
    expect(doc.access).to.equal('private');
    expect(doc.ignore).to.equal(true);
  });

  it('has ES2022 #private method', function () {
    const doc = find('longname', 'src/MyClass.js~MyClass#privateMethod');
    expect(doc.access).to.equal('private');
    expect(doc.ignore).to.equal(true);
  });

  it('has ES2022 #private get', function () {
    const doc = find('longname', 'src/MyClass.js~MyClass#privateAccessor');
    expect(doc.kind).to.equal('get');
    expect(doc.access).to.equal('private');
    expect(doc.ignore).to.equal(true);
  });

  it('has ES2022 #private field', function () {
    const doc = find('longname', 'src/MyClass.js~MyClass#privateField');
    expect(doc.access).to.equal('private');
    expect(doc.ignore).to.equal(true);
  });

  it('has ES2022 static #private method', function () {
    const doc = find('longname', 'src/MyClass.js~MyClass.staticPrivateMethod');
    expect(doc.access).to.equal('private');
    expect(doc.ignore).to.equal(true);
  });

  it('has ES2022 static #private field', function () {
    const doc = find('longname', 'src/MyClass.js~MyClass.staticPrivateField');
    expect(doc.access).to.equal('private');
    expect(doc.ignore).to.equal(true);
  });
});
