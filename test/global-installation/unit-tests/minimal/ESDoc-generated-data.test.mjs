import collectjs from 'collect.js';
import { expect } from 'chai';

import { helper } from '../../helper.mjs';

describe('Check ESDoc generated index.json', function() {
  it('and it contains what we expect', function() {
    // Here we just check some of the data which is expected
    // to be present in index.json
    
    const indexJSON = helper.loadJSONFile(helper.fixturePath, 'docs/index.json');
    
    expect(indexJSON.length).to.equal(16);
    
    const doc0 = collectjs(indexJSON)
      .where('__docId__', '===', 0)
      .firstOrFail();
    
    expect(doc0.kind).to.eql("file");
    expect(doc0.name).to.eql("src/DirectoryA/Identifier.js");

    const doc1 = collectjs(indexJSON)
      .where('__docId__', '===', 1)
      .firstOrFail();
    
    expect(doc1.importStyle).to.eql("{Identifier}");
    expect(doc1.description).to.eql("This Identifier class resides in DirectoryA");
    expect(doc1.longname).to.eql("src/DirectoryA/Identifier.js~Identifier");

    const doc4 = collectjs(indexJSON)
      .where('__docId__', '===', 4)
      .firstOrFail();

    expect(doc4.importStyle).to.eql("{Identifier}");
    expect(doc4.description).to.eql("This Identifier class resides in DirectoryB");
    expect(doc4.longname).to.eql("src/DirectoryB/Identifier.js~Identifier");
    
    const doc12 = collectjs(indexJSON)
      .where('__docId__', '===', 12)
      .firstOrFail();
    
    expect(doc12.access).to.eql(null); // Since plugins are not used, it won't be "public"
    expect(doc12.description).to.eql("Creates instance.");
    expect(doc12.longname).to.eql("src/ESDocTest.js~ESDocTestSingleton#constructor");
  });
});
