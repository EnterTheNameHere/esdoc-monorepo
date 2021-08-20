const fs = require('fs-extra');
const path = require('path');

class Plugin {
  onHandleDocs(ev) {
    this._docs = ev.data.docs;
    this._option = ev.data.option;

    this._exec();
  }

  _exec(){
    this._setDefault();

    const docs = this._generateDocs();
    this._docs.push(...docs);
  }

  _setDefault() {
    //if (!this._option) return;

    //if (!('coverage' in this._option)) this._option.coverage = true;
  }

  _generateDocs() {
    const manual = this._option;
    const results = [];

    if (!this._option) return results;
    
    if( !this._option.files || this._option.files.length === 0 ) {
        const indexFileName = this._option.index || 'readme.md';
        console.warn(`@enterthenamehere/esdoc-manual-plugin:\nNo files in option.files - if you just want to add readme.md file as the main page, just add "index": "${indexFileName}" to your esdoc top config. You don't need manual plugin for this. Otherwise specify which files consist your manual into the option.files for manual plugin.`);
        return results;
    }

    if (manual.index) {
      results.push({
        kind: 'manualIndex',
        globalIndex: manual.globalIndex,
        content: fs.readFileSync(manual.index).toString(),
        longname: path.resolve(manual.index),
        name: manual.index,
        static: true,
        access: 'public'
      });
    } else {
      results.push({
        kind: 'manualIndex',
        globalIndex: false,
        content: null,
        longname: '', // longname does not must be null.
        name: manual.index,
        static: true,
        access: 'public'
      });
    }

    if (manual.asset) {
      results.push({
        kind: 'manualAsset',
        longname: path.resolve(manual.asset),
        name: manual.asset,
        static: true,
        access: 'public'
      });
    }

    for (const filePath of manual.files) {
      results.push({
        kind: 'manual',
        longname: path.resolve(filePath),
        name: filePath,
        content: fs.readFileSync(filePath).toString(),
        static: true,
        access: 'public'
      });
    }

    return results;
  }
}

module.exports = new Plugin();
