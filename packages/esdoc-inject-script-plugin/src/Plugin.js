const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');

class Plugin {
  onStart(ev) {
    this._option = ev.data.option || {};
    if (!('enable' in this._option)) this._option.enable = true;
  }

  onHandleContent(ev) {
    if (!this._option.enable) return;

    const fileName = ev.data.fileName;
    if (path.extname(fileName) !== '.html') return;

    const $ = cheerio.load(ev.data.content);

    const baseNames = new Map();
    for (const script of this._option.scripts) {
      const baseName = path.basename(script);
      if( !baseNames.has(baseName) ) {
        baseNames.set(baseName, 0);
      } else {
        baseNames.set( baseName, baseNames.get(baseName) + 1 );
      }
      const src = `./inject/script/${baseNames.get(baseName)}-${baseName}`;
      $('head').append(`<script src="${src}"></script>`);
    }

    ev.data.content = $.html();
  }

  onPublish(ev) {
    if (!this._option.enable) return;

    const baseNames = new Map();
    for (const script of this._option.scripts) {
      const baseName = path.basename(script);
      if( !baseNames.has(baseName) ) {
        baseNames.set(baseName, 0);
      } else {
        baseNames.set( baseName, baseNames.get(baseName) + 1 );
      }
      const outPath = `inject/script/${baseNames.get(baseName)}-${baseName}`;
      const content = fs.readFileSync(script).toString();
      ev.data.writeFile(outPath, content);
    }
  }
}

module.exports = new Plugin();
