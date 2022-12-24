import IceCap from '@enterthenamehere/ice-cap';
import DocBuilder from './DocBuilder.js';
import { addLineNumbersToSourceCode } from './util.js';

console.log('>>>> __filename', __filename);

/**
 * File output html builder class.
 */
export default class TestFileDocBuilder extends DocBuilder {
  exec(writeFile/*, copyDir*/) {
    const ice = this._buildLayoutDoc();

    const docs = this._find({kind: 'testFile'});
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
   * @returns {string} html of file output.
   * @private
   */
  _buildFileDoc(doc) {
    const content = addLineNumbersToSourceCode(doc.content);

    const ice = new IceCap(this._readTemplate('file.html'));
    ice.text('title', doc.name);
    ice.text('content', content);
    ice.drop('emptySourceCode', Boolean(content));
    return ice.html;
  }
}
