import collectjs from 'collect.js';
import { expect } from 'chai';

import { helper } from '../../helper.mjs';

describe('coverage plugin', function () {
  const coverageJSON = helper.loadJSONFile(helper.fixturePath, 'docs/coverage.json');

  it('covers file as it should', function () {
    const testFile = collectjs(coverageJSON)
      .get("files")
      ["src/Test_Coverage.js"];
    
    // Should find 4 things to document,
    // but only 2 of them are documented,
    // and undocumented are at line 2 and 15
    expect(testFile).deep.equals({
      expectCount: 4,
      actualCount: 2,
      undocumentLines: [2,15]
    });
  });
});
