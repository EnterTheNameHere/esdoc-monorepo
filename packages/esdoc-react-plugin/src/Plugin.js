const path = require('path');
const cheerio = require('cheerio');
const ParamParser = require('@enterthenamehere/esdoc-core/lib/Parser/ParamParser').default;
const DocBuilder = require('@enterthenamehere/esdoc-publish-html-plugin/out/Builder/DocBuilder').default;

class Plugin {
  constructor() {
    this._docs = null;
    this._reactPropsDocs = null;
  }

  onHandleDocs(ev) {
    this._docs = ev.data.docs;

    const reactPropsDocs = [];
    for (const doc of ev.data.docs) {
      if (doc.kind !== 'class') continue;
      if (!doc.unknown) continue;

      const reactProps = doc.unknown.filter( (v) => { return v.tagName === '@reactProps'; });
      if (!reactProps.length) continue;

      reactPropsDocs.push({
        longname: doc.longname,
        fileName: `${doc.longname}.html`,
        reactProps: reactProps
      });
    }

    this._reactPropsDocs = reactPropsDocs;
  }

  onHandleContent(ev) {
    const content = ev.data.content;
    const fileName = ev.data.fileName;

    // only html
    if (path.extname(fileName) !== '.html') return;

    // find target doc
    const doc = this._reactPropsDocs.find( (doc2) => {
      const regexp = new RegExp(`${doc2.fileName.replace('/', '[/|\\\\]')}$`, 'u');
      if (fileName.match(regexp)) return true;
      return false;
    });
    if (!doc) return;

    // create esdoc properties from react props
    const properties = doc.reactProps.map( (reactProp) => {
      const {typeText, paramName, paramDesc} = ParamParser.parseParamValue(reactProp.tagValue);
      return ParamParser.parseParam(typeText, paramName, paramDesc);
    });

    // hack: create html
    const docBuilder = DocBuilder.createDefaultBuilder();
    const html = docBuilder._buildProperties(properties, 'React Props:').html;

    // append html
    const $ = cheerio.load(content, { _useHtmlParser2: true, emptyAttrs: false }, false);
    $('.self-detail.detail').append(html);

    ev.data.content = $.html();
  }
}

module.exports = new Plugin();
