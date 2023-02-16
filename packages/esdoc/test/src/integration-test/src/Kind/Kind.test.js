import assert from 'assert';
import {find} from '../../../../util';

describe('test/Kind/Kind:', function () {
  it('has kind = class', function () {
    const doc = find('longname', 'src/Kind/Kind.js~TestKindClass');
    assert.equal(doc.kind, 'class');
  });

  it('has kind = constructor', function () {
    const doc = find('longname', 'src/Kind/Kind.js~TestKindClass#constructor');
    assert.equal(doc.kind, 'constructor');
  });

  it('has kind = member', function () {
    const doc = find('longname', 'src/Kind/Kind.js~TestKindClass#testKindMember');
    assert.equal(doc.kind, 'member');
  });

  it('has kind = method', function () {
    const doc = find('longname', 'src/Kind/Kind.js~TestKindClass#testKindMethod');
    assert.equal(doc.kind, 'method');
  });

  it('has kind = get', function () {
    const doc = find('longname', 'src/Kind/Kind.js~TestKindClass#testKindGet');
    assert.equal(doc.kind, 'get');
  });

  it('has kind = set', function () {
    const doc = find('longname', 'src/Kind/Kind.js~TestKindClass#testKindSet');
    assert.equal(doc.kind, 'set');
  });

  it('has kind = function', function () {
    const doc = find('longname', 'src/Kind/Kind.js~testKindFunction');
    assert.equal(doc.kind, 'function');
  });

  it('has kind = variable', function () {
    const doc = find('longname', 'src/Kind/Kind.js~testKindVariable');
    assert.equal(doc.kind, 'variable');
  });

  it('has kind = typedef', function () {
    const doc = find('longname', 'src/Kind/Kind.js~testKindTypedef');
    assert.equal(doc.kind, 'typedef');
  });

  it('has kind = external', function () {
    const doc = find('longname', 'src/Kind/Kind.js~testKindExternal');
    assert.equal(doc.kind, 'external');
  });

  it('has kind = file', function () {
      const doc = find('longname', new RegExp('src/Kind/Kind.js$', 'u'));
      assert.equal(doc.kind, 'file');
  });

  it('has kind = packageJSON', function () {
      const doc = find('longname', new RegExp('package.json$', 'u'));
      assert.equal(doc.kind, 'packageJSON');
  });
  
  it('has kind = index', function () {
      const doc = find('longname', new RegExp('README.md$', 'u'));
      assert.equal(doc.kind, 'index');
  });
});
