import collectjs from 'collect.js';
import { expect } from 'chai';

import { helper } from '../../helper.mjs';

describe('external-ecmascript plugin', function () {
  const indexJSON = helper.loadJSONFile(helper.fixturePath, 'docs/index.json');

  it('adds link to MDN for ECMA types', function () {
    const URIErrorItem = collectjs(indexJSON)
      .where('name', '===', 'URIError')
      .firstOrFail();
    
    expect(URIErrorItem).property('kind').to.be.equal('external')
  });
});
