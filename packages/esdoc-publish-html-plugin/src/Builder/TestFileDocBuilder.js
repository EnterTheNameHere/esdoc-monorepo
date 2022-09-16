import IceCap from '@enterthenamehere/ice-cap';
import DocBuilder from './DocBuilder.js';
import { addLineNumbersToSourceCode } from './util.js';

/**
 * File output html builder class.
 */
export default class TestFileDocBuilder extends DocBuilder {
  exec(writeFile/*, copyDir*/) {
    const nav = this._renderTemplate('nav.ejs', this._generateNavData());

    const docs = this._find({kind: ['testFile']});
    for(const doc of docs) {
      const fileName = this._getOutputFileName(doc);
      const baseUrl = this._getBaseUrl(fileName);
      const title = this._getTitle(doc);
      const contents = this._renderTemplate('file.ejs', this._generateFileData(doc));
      writeFile(fileName, this._renderTemplate('layout.ejs', {nav, title, baseUrl, contents, esdocVersion:null, esdocLink:null}));
    }
  }

  exec_old(writeFile/*, copyDir*/) {
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

  _generateFileData(doc) {
    return {
      contents: addLineNumbersToSourceCode(doc.content) || false,
      title: doc.name,
    };
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
