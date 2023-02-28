/* eslint-disable no-template-curly-in-string, no-multi-spaces */
import {readDoc, assert, find, fileNameToDescription} from './../../util.js';

/** @test {MemberDoc#@_name} */
describe(fileNameToDescription(__filename, 'TestComputedProperty:'), function () {
  const doc = readDoc('class/src/Computed/Property.js~TestComputedProperty.html');

  describe('in summary:', function () {
    it('has computed properties.', function () {
      find(doc, '[data-ice="memberSummary"]', (doc)=>{
        assert.includes(doc, `[href="class/src/Computed/Property.js~TestComputedProperty.html#instance-member-['foo']"]`,             `['foo']`);
        assert.includes(doc, `[href="class/src/Computed/Property.js~TestComputedProperty.html#instance-member-[Symbol.iterator]"]`,  `[Symbol.iterator]`);
        assert.includes(doc, '[href="class/src/Computed/Property.js~TestComputedProperty.html#instance-member-[`${foo}`]"]',         '[`${foo}`]');
        assert.includes(doc, `[href="class/src/Computed/Property.js~TestComputedProperty.html#instance-member-[foo + bar]"]`,        `[foo + bar]`);
        assert.includes(doc, `[href="class/src/Computed/Property.js~TestComputedProperty.html#instance-member-[foo()]"]`,            `[foo()]`);
        assert.includes(doc, `[href="class/src/Computed/Property.js~TestComputedProperty.html#instance-member-[foo.bar()]"]`,        `[foo.bar()]`);
        assert.includes(doc, `[href="class/src/Computed/Property.js~TestComputedProperty.html#instance-member-[foo.bar.baz]"]`,      `[foo.bar.baz]`);
        assert.includes(doc, `[href="class/src/Computed/Property.js~TestComputedProperty.html#instance-member-[foo.bar]"]`,          `[foo.bar]`);
        assert.includes(doc, `[href="class/src/Computed/Property.js~TestComputedProperty.html#instance-member-[foo.p + bar]"]`,      `[foo.p + bar]`);
        assert.includes(doc, `[href="class/src/Computed/Property.js~TestComputedProperty.html#instance-member-[foo]"]`,              `[foo]`);
      });
    });
  });

  describe('in detail:', function () {
    it('has computed properties.', function () {
      assert.includes(doc, `[id="instance-member-['foo']"] [data-ice="name"]`,            `['foo']`);
      assert.includes(doc, `[id="instance-member-[Symbol.iterator]"] [data-ice="name"]`,  `[Symbol.iterator]`);
      assert.includes(doc, '[id="instance-member-[`${foo}`]"] [data-ice="name"]',         '[`${foo}`]');
      assert.includes(doc, `[id="instance-member-[foo + bar]"] [data-ice="name"]`,        `[foo + bar]`);
      assert.includes(doc, `[id="instance-member-[foo()]"] [data-ice="name"]`,            `[foo()]`);
      assert.includes(doc, `[id="instance-member-[foo.bar()]"] [data-ice="name"]`,        `[foo.bar()]`);
      assert.includes(doc, `[id="instance-member-[foo.bar.baz]"] [data-ice="name"]`,      `[foo.bar.baz]`);
      assert.includes(doc, `[id="instance-member-[foo.bar]"] [data-ice="name"]`,          `[foo.bar]`);
      assert.includes(doc, `[id="instance-member-[foo.p + bar]"] [data-ice="name"]`,      `[foo.p + bar]`);
      assert.includes(doc, `[id="instance-member-[foo]"] [data-ice="name"]`,              `[foo]`);
    });
  });
});
