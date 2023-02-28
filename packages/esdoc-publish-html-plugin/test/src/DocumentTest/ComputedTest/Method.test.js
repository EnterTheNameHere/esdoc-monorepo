/* eslint-disable no-template-curly-in-string, no-multi-spaces */
import {readDoc, assert, find, fileNameToDescription} from './../../util.js';

/** @test {MethodDoc#@_name} */
describe(fileNameToDescription(__filename, 'TestComputedMethod:'), function () {
  const doc = readDoc('class/src/Computed/Method.js~TestComputedMethod.html');

  describe('in summary:', function () {
    it('has computed methods.', function () {
      find(doc, '[data-ice="summary"]', (doc)=>{
        assert.includes(doc, `[href="class/src/Computed/Method.js~TestComputedMethod.html#instance-method-['foo']"]`,            `['foo']`);
        assert.includes(doc, `[href="class/src/Computed/Method.js~TestComputedMethod.html#instance-method-[Symbol.iterator]"]`,  `[Symbol.iterator]`);
        assert.includes(doc, '[href="class/src/Computed/Method.js~TestComputedMethod.html#instance-method-[`${foo}`]"]',       '[`${foo}`]');
        assert.includes(doc, `[href="class/src/Computed/Method.js~TestComputedMethod.html#instance-method-[foo + bar]"]`,        `[foo + bar]`);
        assert.includes(doc, `[href="class/src/Computed/Method.js~TestComputedMethod.html#instance-method-[foo()]"]`,            `[foo()]`);
        assert.includes(doc, `[href="class/src/Computed/Method.js~TestComputedMethod.html#instance-method-[foo.bar()]"]`,        `[foo.bar()]`);
        assert.includes(doc, `[href="class/src/Computed/Method.js~TestComputedMethod.html#instance-method-[foo.bar.baz]"]`,      `[foo.bar.baz]`);
        assert.includes(doc, `[href="class/src/Computed/Method.js~TestComputedMethod.html#instance-method-[foo.bar]"]`,          `[foo.bar]`);
        assert.includes(doc, `[href="class/src/Computed/Method.js~TestComputedMethod.html#instance-method-[foo.p + bar]"]`,      `[foo.p + bar]`);
        assert.includes(doc, `[href="class/src/Computed/Method.js~TestComputedMethod.html#instance-method-[foo]"]`,              `[foo]`);
      });
    });
  });

  describe('in detail:', function () {
    it('has computed method.', function () {
      assert.includes(doc, `[id="instance-method-['foo']"] [data-ice="name"]`,            `['foo']`);
      assert.includes(doc, `[id="instance-method-[Symbol.iterator]"] [data-ice="name"]`,  `[Symbol.iterator]`);
      assert.includes(doc, '[id="instance-method-[`${foo}`]"] [data-ice="name"]',       '[`${foo}`]');
      assert.includes(doc, `[id="instance-method-[foo + bar]"] [data-ice="name"]`,        `[foo + bar]`);
      assert.includes(doc, `[id="instance-method-[foo()]"] [data-ice="name"]`,            `[foo()]`);
      assert.includes(doc, `[id="instance-method-[foo.bar()]"] [data-ice="name"]`,        `[foo.bar()]`);
      assert.includes(doc, `[id="instance-method-[foo.bar.baz]"] [data-ice="name"]`,      `[foo.bar.baz]`);
      assert.includes(doc, `[id="instance-method-[foo.bar]"] [data-ice="name"]`,          `[foo.bar]`);
      assert.includes(doc, `[id="instance-method-[foo.p + bar]"] [data-ice="name"]`,      `[foo.p + bar]`);
      assert.includes(doc, `[id="instance-method-[foo]"] [data-ice="name"]`,              `[foo]`);
    });
  });
});
