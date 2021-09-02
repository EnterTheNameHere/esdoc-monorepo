const path = require('path');
const cheerio = require('cheerio');

class Plugin {
  onStart(ev) {
    this._option = ev.data.option || {};
    if (!('enable' in this._option)) this._option.enable = true;
  }

  onHandleContent(ev) {
    if (!this._option.enable) return;
    if (path.extname(ev.data.fileName) !== '.html') return;

    const $ = cheerio.load(ev.data.content);

    const baseNames = new Map();
    for (const style of this._option.styles) {
      const baseName = path.basename(style);
      if( !baseNames.has(baseName) ) {
        baseNames.set( baseName, 0 );
      } else {
        baseNames.set( baseName, baseNames.get(baseName) + 1 );
      }
      const src = `./inject/css/${baseNames.get(baseName)}-${baseName}`;
      $('head').append(`<link rel="stylesheet" href="${src}"/>`);
    }

    ev.data.content = $.html();
  }

  onPublish(ev) {
    if (!this._option.enable) return;

    const baseNames = new Map();
    for (const style of this._option.styles) {
      const baseName = path.basename(style);
      if( !baseNames.has(baseName) ) {
        baseNames.set( baseName, 0 );
      } else {
        baseNames.set( baseName, baseNames.get(baseName) + 1 );
      }
      const outPath = `inject/css/${baseNames.get(baseName)}-${baseName}`;
      const content = ev.FileManager.loadFileContents(style);
      ev.data.writeFile(outPath, content);
    }
  }
}

module.exports = new Plugin();
