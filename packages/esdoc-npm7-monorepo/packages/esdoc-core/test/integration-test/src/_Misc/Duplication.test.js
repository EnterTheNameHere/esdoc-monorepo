import assert from 'assert';

describe('test/_Misc/Duplication:', function () {
  it('does not duplication', function () {
    const docs = global.docs.filter((doc) => { return doc.longname === 'src/_Misc/Duplication.js~TestDuplication#member'; });
    assert.equal(docs.length, 1);

    const doc = docs[0];
    assert.deepEqual(doc.type, {
      "nullable": null,
      "types": [
        "number"
      ],
      "spread": false,
      "description": null
    });
  });
});
