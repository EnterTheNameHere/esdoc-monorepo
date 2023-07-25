const upath = require('upath');
const fse = require('fs-extra');

class Plugin {
  getDefaultOptions() {
    return {
      index: 'README.md',
      globalIndex: false, // TODO: What globalIndex means?
      files: [],
      asset: null, // TODO: Implement support for directories
    };
  }

  onHandleDocs(ev) {
    this._docs = ev.data.docs;
    this._option = ev.data.option;
    this.debug = ev.debug;

    this._exec(ev);
  }

  _exec(ev){
    const docs = this._generateDocs(ev);
    this._docs.push(...docs);
  }

  _generateDocs(ev) {
    this.debug('Generating docs with options:', this._option);
    const manual = this._option;
    const results = [];
    
    if (!manual) return results;
    
    if( !manual.files || manual.files.length === 0 ) {
        const indexFileName = manual.index;
        // TODO: There is "index" in esdoc top config? Shouldn't it be to add it to "manual": { "index": "readme.md" }?
        console.warn(`@enterthenamehere/esdoc-manual-plugin:\nNo files in option.files - if you just want to add readme.md file as the main page, just add "index": "${indexFileName}" to your esdoc top config. You don't need manual plugin for this. Otherwise specify which files consist your manual into the option.files for manual plugin.`);
        return results;
    }
    
    // TODO: Report if file is not found and is not default value?
    if (!fse.existsSync(manual.index)) {
      this.debug('manual.index file %o doesn\'t exist. Setting it to null');
      manual.index = null;
    }
    
    if (manual.index) {
      results.push({
        kind: 'manualIndex',
        globalIndex: manual.globalIndex,
        content: ev.FileManager.readFileContents(manual.index),
        longname: upath.resolve(manual.index),
        name: manual.index,
        static: true,
        access: 'public'
      });
    } else {
      results.push({
        kind: 'manualIndex',
        globalIndex: false,
        content: null,
        longname: '', // longname must not be null.
        name: manual.index,
        static: true,
        access: 'public'
      });
    }

    if (manual.asset) {
      results.push({
        kind: 'manualAsset',
        longname: upath.resolve(manual.asset),
        name: manual.asset,
        static: true,
        access: 'public'
      });
    }

    for (const filePath of manual.files) {
      results.push({
        kind: 'manual',
        longname: upath.resolve(filePath),
        name: filePath,
        content: ev.FileManager.readFileContents(filePath),
        static: true,
        access: 'public'
      });
    }
    
    this.debug('Generating docs results:', results);

    return results;
  }
}

module.exports = new Plugin();
