import path from 'path';
import IceCap from '@enterthenamehere/ice-cap';
import DocBuilder from './DocBuilder.js';
import {markdown} from './util.js';

/**
 * Index output builder class.
 */
export default class IndexDocBuilder extends DocBuilder {
  exec(writeFile/*, copyDir*/) {
    const nav = this._renderTemplate('nav.ejs', this._generateNavData());
    const title = 'Home';
    const contents = this._generateIndexData();

    writeFile('index.html', this._renderTemplate('layout.ejs',{nav, title, baseUrl: '../', contents, esdocVersion:null, esdocLink:null}));
  }

  exec_old(writeFile/*, copyDir*/) {
    const ice = this._buildLayoutDoc();
    const title = this._getTitle('Home');
    ice.load('content', this._buildIndexDoc());
    ice.text('title', title, IceCap.MODE_WRITE);
    writeFile('index.html', ice.html);
  }
  
  _generateIndexData() {
    return 'index doc contents here';
  }

  /**
   * build index output.
   * @returns {string} html of index output.
   * @private
   */
  _buildIndexDoc() {
    const indexTag = this._tags.find((tag) => { return tag.kind === 'index'; });
    if (!indexTag) return 'Please create README.md';

    const indexContent = indexTag.content;

    const html = this._readTemplate('index.html');
    const ice = new IceCap(html);
    const ext = path.extname(indexTag.name);
    if (['.md', '.markdown'].includes(ext)) {
      ice.load('index', markdown(indexContent));
    } else {
      ice.load('index', indexContent);
    }

    return ice.html;
  }
}
