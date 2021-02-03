import assert from 'assert';
import {find} from '../../../util';

describe('test/Desc/Desc:', function () {
  it('has class desc', function () {
    const doc = find('longname', 'src/Desc/Desc.js~TestDescClass') ;
    assert.equal(doc.description, 'this is TestDescClass.');
  });

  it('has constructor desc', function () {
    const doc = find('longname', 'src/Desc/Desc.js~TestDescClass#constructor') ;
    assert.equal(doc.description, 'this is constructor.');
  });

  it('has member desc', function () {
    const doc = find('longname', 'src/Desc/Desc.js~TestDescClass#memberDesc') ;
    assert.equal(doc.description, 'this is memberDesc.');
  });

  it('has method desc', function () {
    const doc = find('longname', 'src/Desc/Desc.js~TestDescClass#methodDesc') ;
    assert.equal(doc.description, 'this is methodDesc.');
  });

  it('has getter desc', function () {
    const doc = find('longname', 'src/Desc/Desc.js~TestDescClass#getterDesc') ;
    assert.equal(doc.description, 'this is getterDesc.');
  });

  it('has setter desc', function () {
    const doc = find('longname', 'src/Desc/Desc.js~TestDescClass#setterDesc') ;
    assert.equal(doc.description, 'this is setterDesc.');
  });

  it('has function desc', function () {
    const doc = find('longname', 'src/Desc/Desc.js~testDescFunction') ;
    assert.equal(doc.description, 'this is testDescFunction.');
  });

  it('has variable desc', function () {
    const doc = find('longname', 'src/Desc/Desc.js~testDescVariable') ;
    assert.equal(doc.description, 'this is testDescVariable.');
  });

  it('has typedef desc', function () {
    const doc = find('longname', 'src/Desc/Desc.js~TestDescTypedef') ;
    assert.equal(doc.description, 'this is TestDescTypedef.');
  });

  it('has external desc', function () {
    const doc = find('longname', 'src/Desc/Desc.js~TestDescExternal') ;
    assert.equal(doc.description, 'this is TestDescExternal.');
  });
});
