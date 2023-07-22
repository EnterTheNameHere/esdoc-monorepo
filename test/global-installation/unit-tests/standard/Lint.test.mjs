import collectjs from 'collect.js';
import { expect } from 'chai';

import { helper } from '../../helper.mjs';

describe('lint plugin', function () {
  const lintJSON = helper.loadJSONFile(helper.fixturePath, 'docs/lint.json');

  it('finds incomplete documentation', function () {
    // Compare two arrays to find out which one is missing documentation
    const existingParams = collectjs(lintJSON)
      .where('name', '===', 'incompleteArrowFunctionDocumentation')
      .firstOrFail()
      .codeParams;
    const documentedParams = collectjs(lintJSON)
      .where('name', '===', 'incompleteArrowFunctionDocumentation')
      .firstOrFail()
      .docParams;
    const undocumentedParam = collectjs(existingParams).diff(documentedParams).firstOrFail();
    
    expect(undocumentedParam).to.be.equal('param1');
  });
});
