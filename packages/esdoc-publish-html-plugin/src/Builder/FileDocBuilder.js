import IceCap from '@enterthenamehere/ice-cap';
import DocBuilder from './DocBuilder.js';
import { addLineNumbersToSourceCode } from './util';

console.log('__filename', __filename, '__dirname', __dirname);

/**
 * File output builder class.
 */
export default class FileDocBuilder extends DocBuilder {
  exec(writeFile/*, copyDir*/) {
    const ice = this._buildLayoutDoc();

    const docs = this._find({kind: 'file'});
    for (const doc of docs) {
      const fileName = this._getOutputFileName(doc);
      const baseUrl = this._getBaseUrl(fileName);
      const title = this._getTitle(doc);
      ice.load('content', this._buildFileDoc(doc), IceCap.MODE_WRITE);
      ice.attr('baseUrl', 'href', baseUrl, IceCap.MODE_WRITE);
      ice.text('title', title, IceCap.MODE_WRITE);
      writeFile(fileName, ice.html);
    }
  }

  /**
   * build file output html.
   * @param {DocObject} doc - target file doc object.
   * @returns {string} html of file page.
   * @private
   */
  _buildFileDoc(doc) {
    const content = addLineNumbersToSourceCode(doc.content);

    const ice = new IceCap(this._readTemplate('file.html'));
    ice.text('title', doc.name);
    ice.load('content', content);
    ice.drop('emptySourceCode', Boolean(content));
    return ice.html;
  }
}
