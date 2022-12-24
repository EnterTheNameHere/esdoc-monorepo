import IceCap from '@enterthenamehere/ice-cap';
import DocBuilder from './DocBuilder.js';
import path from 'path';
import {escapeURLHash} from './util';

console.log('__filename', __filename, '__dirname', __dirname);

/**
 * Identifier output builder class.
 */
export default class IdentifiersDocBuilder extends DocBuilder {
  exec(writeFile/*, copyDir*/) {
    const ice = this._buildLayoutDoc();
    const title = this._getTitle('Reference');
    ice.load('content', this._buildIdentifierDoc());
    ice.text('title', title, IceCap.MODE_WRITE);
    writeFile('identifiers.html', ice.html);
  }

  /**
   * build identifier output.
   * @return {IceCap} built output.
   * @private
   */
  _buildIdentifierDoc() {
    const ice = new IceCap(this._readTemplate('identifiers.html'));

    // traverse docs and create Map<dirPath, doc[]>
    const dirDocs = new Map();
    const kinds = ['class', 'interface', 'function', 'variable', 'typedef', 'external'];
    for (const doc of this._tags) {
      if (!kinds.includes(doc.kind)) continue;
      if (doc.builtinExternal) continue;
      if (doc.ignore) continue;

      const filePath = doc.memberof.replace(/^.*?[/]/u, '');
      const dirPath = path.dirname(filePath);
      if (!dirDocs.has(dirPath)) dirDocs.set(dirPath, []);
      dirDocs.get(dirPath).push(doc);
    }

    // create a summary of dir
    const dirPaths = Array.from(dirDocs.keys()).sort((a, b) => { return a > b ? 1 : -1; });
    const kindOrder = {class: 0, interface: 1, function: 2, variable: 3, typedef: 4, external: 5};
    ice.loop('dirSummaryWrap', dirPaths, (i, dirPath, ice2) => {
      const docs = dirDocs.get(dirPath);

      // see: DocBuilder#_buildNavDoc
      docs.sort((a, b) =>  {
        const kindA = a.interface ? 'interface' : a.kind;
        const kindB = b.interface ? 'interface' : b.kind;
        if (kindA === kindB) {
          return a.longname > b.longname ? 1 : -1;
        }
        
        return kindOrder[kindA] > kindOrder[kindB] ? 1 : -1;
      });

      const dirPathLabel = dirPath === '.' ? '' : dirPath;
      const summary = this._buildSummaryDoc(docs, `summary`, false, true);
      ice2.text('dirPath', dirPathLabel);
      ice2.attr('dirPath', 'id', escapeURLHash(dirPath));
      ice2.load('dirSummary', summary);
    });

    const dirTree = this._buildDirTree(dirPaths);
    ice.load('dirTree', dirTree);
    ice.drop('dirTreeWrap', !dirTree);

    return ice;
  }

  _buildDirTree(dirPaths) {
    const lines = [];
    for (const dirPath of dirPaths) {
      const padding = dirPath.split('/').length - 1;
      const dirName = path.basename(dirPath);
      if (dirName === '.') continue;
      const hash = escapeURLHash(dirPath);
      lines.push(`<div style="padding-left: ${padding}em"><a href="#${hash}">${dirName}</a></div>`);
    }

    return lines.join('\n');
  }
}
