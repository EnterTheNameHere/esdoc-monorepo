import IceCap from '@enterthenamehere/ice-cap';
import DocBuilder from './DocBuilder.js';

/**
 * Single output builder class.
 * "single" means function, variable, typedef, external, etc...
 */
export default class SingleDocBuilder extends DocBuilder {
  exec(writeFile/*, copyDir*/) {
    const nav = this._renderTemplate('nav.ejs', this._generateNavData());
    
    const kinds = ['function', 'variable', 'typedef'];
    for(const kind of kinds) {
      const docs = this._find({kind: kind});
      if(!docs.length) continue;
      const fileName = this._getOutputFileName(docs[0]);
      const baseUrl = this._getBaseUrl(fileName);
      const title = kind.replace(/^(\w)/u, (c) => { return c.toUpperCase(); });
      
      const contents = this._generateSingleDoc(kind);
      writeFile(fileName, this._renderTemplate('layout.ejs',{nav, title, baseUrl, contents, esdocVersion:null, esdocLink:null}));
    }
  }

  exec_old(writeFile/*, copyDir*/) {
    const ice = this._buildLayoutDoc();
    ice.autoClose = false;

    const kinds = ['function', 'variable', 'typedef'];
    for (const kind of kinds) {
      const docs = this._find({kind: kind});
      if (!docs.length) continue;
      const fileName = this._getOutputFileName(docs[0]);
      const baseUrl = this._getBaseUrl(fileName);
      let title = kind.replace(/^(\w)/u, (c) => { return c.toUpperCase(); });
      title = this._getTitle(title);

      ice.load('content', this._buildSingleDoc(kind), IceCap.MODE_WRITE);
      ice.attr('baseUrl', 'href', baseUrl, IceCap.MODE_WRITE);
      ice.text('title', title, IceCap.MODE_WRITE);
      writeFile(fileName, ice.html);
    }
  }
  
  /**
   * 
   * @param {string} kind 
   * @returns {string}
   */
  _generateSingleDoc(kind) {
    const title = kind.replace(/^(\w)/u, (char) => { return char.toUpperCase(); });
    return this._renderTemplate('single.ejs', {
      title: title,
      summariesData: this._generateSummaryData(null, kind, 'Summary'),
      detailsData: this._generateDetailsData(null, kind, ''),
    });
  }

  /**
   * build single output.
   * @param {string} kind - target kind property.
   * @returns {string} html of single output
   * @private
   */
  _buildSingleDoc(kind) {
    const title = kind.replace(/^(\w)/u, (c) => { return c.toUpperCase(); });
    const ice = new IceCap(this._readTemplate('single.html'));
    ice.text('title', title);
    ice.load('summaries', this._buildSummaryHTML(null, kind, 'Summary'), 'append');
    ice.load('details', this._buildDetailHTML(null, kind, ''));
    return ice.html;
  }
}
