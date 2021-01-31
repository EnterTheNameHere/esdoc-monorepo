const assert = require('assert');
const {find, file} = require('../util');

describe('test/manual:', function () {
  it('has manual index', function () {
    const doc = find('longname', /manual[\\|/]index.md$/u);
    assert.equal(doc.content, file(doc.name));
    assert.equal(doc.globalIndex, true);
  });

  it('has manual asset', function () {
    const doc = find('longname', /manual[\\|/]asset$/u);
    assert(doc);
  });

  it('has manual overview', function () {
    const doc = find('longname', /manual[\\|/]overview.md$/u);
    assert.equal(doc.content, file(doc.name));
  });

  it('has manual design', function () {
    const doc = find('longname', /manual[\\|/]design.md$/u);
    assert.equal(doc.content, file(doc.name));
  });

  it('has manual installation', function () {
    const doc = find('longname', /manual[\\|/]installation.md$/u);
    assert.equal(doc.content, file(doc.name));
  });

  it('has manual usage', function () {
    const [doc1, doc2] = find('longname', /manual[\\|/]usage1.md$/u, /manual[\\|/]usage2.md$/u);
    assert.equal(doc1.content, file(doc1.name));
    assert.equal(doc2.content, file(doc2.name));
  });

  it('has manual tutorial', function () {
    const doc = find('longname', /manual[\\|/]tutorial.md$/u);
    assert.equal(doc.content, file(doc.name));
  });

  it('has manual configuration', function () {
    const doc = find('longname', /manual[\\|/]configuration.md$/u);
    assert.equal(doc.content, file(doc.name));
  });

  it('has manual example', function () {
    const doc = find('longname', /manual[\\|/]example.md$/u);
    assert.equal(doc.content, file(doc.name));
  });

  it('has manual advanced', function () {
    const doc = find('longname', /manual[\\|/]advanced.md$/u);
    assert.equal(doc.content, file(doc.name));
  });

  it('has manual faq', function () {
    const doc = find('longname', /manual[\\|/]faq.md$/u);
    assert.equal(doc.content, file(doc.name));
  });

  it('has manual changelog', function () {
    const doc = find('longname', /CHANGELOG.md$/u);
    assert.equal(doc.content, file(doc.name));
  });
});
