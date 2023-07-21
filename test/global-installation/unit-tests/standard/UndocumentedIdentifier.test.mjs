import collectjs from 'collect.js';
import { expect } from 'chai';

import { helper } from '../../helper.mjs';

describe('undocumented-identifier plugin', function () {
  const indexJSON = helper.loadJSONFile(helper.fixturePath, 'docs/index.json');

  it('adds ignore property where ', function () {
    const identifierWithoutIgnore = collectjs(indexJSON)
      .where('name', '===', 'shouldNotHaveIgnore')
      .firstOrFail();
    const identifierWithIgnore = collectjs(indexJSON)
      .where('name', '===', 'shouldHaveIgnore')
      .firstOrFail();
    
    expect(identifierWithoutIgnore).to.not.contain.property('ignore');
    expect(identifierWithIgnore).property('ignore').to.equal(true);
  });
});
