/* eslint-disable max-lines */
import path from 'path';
import IceCap from '@enterthenamehere/ice-cap';
import logger from '@enterthenamehere/color-logger';
import escapeStringRegexp from 'escape-string-regexp';
import {shorten, parseExample, escapeURLHash, sanitize, highlight} from './util.js';
import DocResolver from './DocResolver.js';
import NPMUtil from '@enterthenamehere/esdoc-core/lib/Util/NPMUtil.js';
import { FileManager } from '@enterthenamehere/esdoc-core/lib/Util/FileManager.js';
import { HTMLTemplate } from './HTMLTemplate.js';

/**
 * Builder base class.
 */
export default class DocBuilder {
  /**
   * create instance.
   * @param {object}            params
   * @param {PublishHtmlPlugin} params.pluginInstance Instance to PublishHtmlPlugin
   */
  constructor(params) {
    if(!params || typeof params !== 'object') {
      const errorText = `Error: DocBuilder constructor's params is expected to be an object!`;
      console.error(errorText);
      throw new TypeError(errorText);
    }

    if(!Object.prototype.hasOwnProperty.call(params, 'pluginInstance')) {
      const errorText = `Error: DocBuilder params.pluginInstance is expected to be PublishHtmlPlugin instance!`;
      console.error(errorText);
      throw new TypeError(errorText);
    }

    this._pluginInstance = params.pluginInstance;
    
    this._data = this.Plugin.Data;
    this._tags = this.Plugin.Tags;
    new DocResolver(this).resolve();
  }

  /* eslint-disable no-unused-vars */
  /**
   * execute building output.
   * @abstract
   * @param {function(html: string, filePath: string)} writeFile - is called each manual.
   * @param {function(src: string, dest: string)} copyDir - is called asset.
   */
  exec(writeFile, copyDir) {
  }

  /**
   * find doc object.
   * @param {...Object} cond - find condition.
   * @returns {DocObject[]} found doc objects.
   * @private
   */
  _find(...cond) {
    return this._orderedFind(null, ...cond);
  }

  /**
   * find all identifiers with kind grouping.
   * @returns {{class: DocObject[], interface: DocObject[], function: DocObject[], variable: DocObject[], typedef: DocObject[], external: DocObject[]}} found doc objects.
   * @private
   */
  _findAllIdentifiersKindGrouping() {
    const result = {
      class: this._find([{kind: 'class', interface: false}]),
      interface: this._find([{kind: 'class', interface: true}]),
      function: this._find([{kind: 'function'}]),
      variable: this._find([{kind: 'variable'}]),
      typedef: this._find([{kind: 'typedef'}]),
      external: this._find([{kind: 'external'}]).filter((v) => { return !v.builtinExternal; })
    };
    return result;
  }

  /**
   * fuzzy find doc object by name.
   * - equal with longname
   * - equal with name
   * - include in longname
   * - include in ancestor
   *
   * @param {string} name - target identifier name.
   * @param {string} [kind] - target kind.
   * @returns {DocObject[]} found doc objects.
   * @private
   */
  _findByName(name, kind = null) {
    let docs = [];

    if (kind) {
      docs = this._orderedFind(null, {longname: name, kind: kind});
    } else {
      docs = this._orderedFind(null, {longname: name});
    }
    if (docs.length) return docs;

    if (kind) {
      docs = this._orderedFind(null, {name: name, kind: kind});
    } else {
      docs = this._orderedFind(null, {name: name});
    }
    if (docs.length) return docs;
    
    const sanitizedName = escapeStringRegexp(name);
    const regexp = new RegExp(`[~]${sanitizedName}$`, 'u');
    
    if (kind) {
      docs = this._orderedFind(null, {longname: {regex: regexp}, kind: kind});
    } else {
      docs = this._orderedFind(null, {longname: {regex: regexp}});
    }
    if (docs.length) return docs;

    // inherited method?
    const matched = name.match(/(.*)[.#](.*)$/u); // instance method(Foo#bar) or static method(Foo.baz)
    if (matched) {
      const parent = matched[1];
      const childName = matched[2];
      const parentDoc = this._findByName(parent, 'class')[0];
      if (parentDoc && parentDoc._custom_extends_chains) {
        for (const superLongname of parentDoc._custom_extends_chains) {
          const docs2 = this._find({memberof: superLongname, name: childName});
          if (docs2.length) return docs2;
        }
      }
    }

    return [];
  }

  /**
   * find doc objects that is ordered.
   * @param {string} order - doc objects order(``column asec`` or ``column desc``).
   * @param {...Object} cond - condition objects
   * @returns {DocObject[]} found doc objects.
   * @private
   */
  _orderedFind(order, ...cond) {
    const data = this._data(...cond);

    if (order) {
      return data.order(`${order}, name asec`).map((v) => { return v; });
    }
    
    return data.order('name asec').map((v) => { return v; });
  }

  /**
   * read html template.
   * @param {string} fileName - template file name.
   * @return {string} html of template.
   * @protected
   */
  _readTemplate(fileName) {
    const filePath = path.resolve(this.Plugin.TemplateDirectory, `./${fileName}`);
    return FileManager.readFileContents(filePath);
  }
  
  _renderTemplate(fileName, data) {
    const filePath = path.resolve(path.join(this.Plugin.TemplateDirectory, fileName));
    const contents = FileManager.readFileContents(filePath);
    return HTMLTemplate.render(contents, data);
  }
  
  
  /**
   * build common layout output.
   * @return {IceCap} layout output.
   * @private
   */
  _buildLayoutDoc() {
    const ice = new IceCap(this._readTemplate('layout.html'), {autoClose: false});

    const packageObj = NPMUtil.findPackage();
    if (packageObj) {
      ice.text('esdocVersion', `(${packageObj.version})`);
    } else {
      ice.drop('esdocVersion');
    }

    const existTest = this._tags.find((tag) => { return tag.kind.indexOf('test') === 0; });
    ice.drop('testLink', !existTest);

    const existManual = this._tags.find((tag) => { return tag.kind.indexOf('manual') === 0; });
    ice.drop('manualHeaderLink', !existManual);

    const manualIndex = this._tags.find((tag) => { return tag.kind === 'manualIndex'; });
    if (manualIndex && manualIndex.globalIndex) {
      ice.drop('manualHeaderLink');
    }

    ice.load('nav', this._buildNavDoc());
    return ice;
  }
  
  _buildLayoutEjs( nav='nav here', title='title here', baseUrl='', contents='contents here', esdocVersion='0.0.0', esdocLink='linkHere' ) {
    const html = FileManager.readFileContents(path.join(this.Plugin.TemplateDirectory, 'layout.ejs'));
    return HTMLTemplate.render(html, {nav, title, baseUrl, contents, esdocVersion, esdocLink});
  }
  
  _generateNavData() {
    const navData = { docs: [] };
    
    const kinds = ['class', 'function', 'variable', 'typedef', 'external'];
    const allDocs = this._find({kind: kinds}).filter((v) => { return !v.builtinExternal; });
    const kindOrder = {class: 0, interface: 1, function: 2, variable: 3, typedef: 4, external: 5};
    
    // see: IdentifiersDocBuilder#_buildIdentifierDoc
    allDocs.sort((a, b) => {
      const filePathA = a.longname.split('~')[0];
      const filePathB = b.longname.split('~')[0];
      const dirPathA = path.dirname(filePathA);
      const dirPathB = path.dirname(filePathB);
      const kindA = a.interface ? 'interface' : a.kind;
      const kindB = b.interface ? 'interface' : b.kind;
      if (dirPathA === dirPathB) {
        if (kindA === kindB) {
          return a.longname > b.longname ? 1 : -1;
        }
        
        return kindOrder[kindA] > kindOrder[kindB] ? 1 : -1;
      }
    
      return dirPathA > dirPathB ? 1 : -1;
    });
    
    for( const doc of allDocs ) {
      const filePath = doc.longname.split('~')[0].replace(/^.*?[/]/u, '');
      const dirPath = path.dirname(filePath);
      const kind = doc.interface ? 'interface' : doc.kind;
      const kindText = kind.charAt(0).toUpperCase();
      const kindClass = `kind-${kind}`;
      const linkToIdentifierData = this._generateDocLinkData(doc.longname);
      navData.docs.push({
        name: linkToIdentifierData.name,
        href: linkToIdentifierData.href || false,
        kind: kindText,
        kindClass: kindClass,
        dirPath: dirPath,
        dirPathHref: `identifiers.html#${escapeURLHash(dirPath)}`,
      });
    }
    
    return navData;
  }

  /**
   * build common navigation output.
   * @return {IceCap} navigation output.
   * @private
   */
  _buildNavDoc() {
    const html = this._readTemplate('nav.html');
    const ice = new IceCap(html);

    const kinds = ['class', 'function', 'variable', 'typedef', 'external'];
    const allDocs = this._find({kind: kinds}).filter((v) => { return !v.builtinExternal; });
    const kindOrder = {class: 0, interface: 1, function: 2, variable: 3, typedef: 4, external: 5};

    // see: IdentifiersDocBuilder#_buildIdentifierDoc
    allDocs.sort((a, b) => {
      const filePathA = a.longname.split('~')[0];
      const filePathB = b.longname.split('~')[0];
      const dirPathA = path.dirname(filePathA);
      const dirPathB = path.dirname(filePathB);
      const kindA = a.interface ? 'interface' : a.kind;
      const kindB = b.interface ? 'interface' : b.kind;
      if (dirPathA === dirPathB) {
        if (kindA === kindB) {
          return a.longname > b.longname ? 1 : -1;
        }
        
        return kindOrder[kindA] > kindOrder[kindB] ? 1 : -1;
      }
    
      return dirPathA > dirPathB ? 1 : -1;
    });
    let lastDirPath = '.';
    ice.loop('doc', allDocs, (i, doc, ice2) => {
      const filePath = doc.longname.split('~')[0].replace(/^.*?[/]/u, '');
      const dirPath = path.dirname(filePath);
      const kind = doc.interface ? 'interface' : doc.kind;
      const kindText = kind.charAt(0).toUpperCase();
      const kindClass = `kind-${kind}`;
      ice2.load('name', this._buildDocLinkHTML(doc.longname));
      ice2.load('kind', kindText);
      ice2.attr('kind', 'class', kindClass);
      ice2.text('dirPath', dirPath);
      ice2.attr('dirPath', 'href', `identifiers.html#${escapeURLHash(dirPath)}`);
      ice2.drop('dirPath', lastDirPath === dirPath);
      lastDirPath = dirPath;
    });

    return ice;
  }

  /**
   * find doc object for each access.
   * @param {DocObject} doc - parent doc object.
   * @param {string} kind - kind property condition.
   * @param {boolean} isStatic - static property condition
   * @returns {Array[]} found doc objects.
   * @property {Array[]} 0 - ['Public', DocObject[]]
   * @property {Array[]} 1 - ['Protected', DocObject[]]
   * @property {Array[]} 2 - ['Private', DocObject[]]
   * @private
   */
  _findAccessDocs(doc, kind, isStatic = true) {
    const cond = {kind: kind, static: isStatic};

    if (doc) cond.memberof = doc.longname;

    /* eslint-disable default-case */
    switch (kind) {
      case 'class':
        cond.interface = false;
        break;
      case 'interface':
        cond.kind = 'class';
        cond.interface = true;
        break;
      case 'member':
        cond.kind = ['member', 'get', 'set'];
        break;
    }

    const publicDocs = this._find(cond, {access: 'public'}).filter((v) => { return !v.builtinExternal; });
    const protectedDocs = this._find(cond, {access: 'protected'}).filter((v) => { return !v.builtinExternal; });
    const privateDocs = this._find(cond, {access: 'private'}).filter((v) => { return !v.builtinExternal; });
    const accessDocs = [['Public', publicDocs], ['Protected', protectedDocs], ['Private', privateDocs]];

    return accessDocs;
  }
  
  _generateSummaryData(docs, title, innerLink = false, kindIcon = false) {
    const summaryData = {
      title: title,
      docs: []
    };

    for( const doc of docs ) {
      const docData = {};
      docData.generator = doc.generator || false;
      docData.async = doc.async || false;
      docData.signature = {
        ...this._generateDocLinkData(doc.longname, null, innerLink, doc.kind),
        ...this._generateSignatureData(doc),
      };
      docData.shortDescription = shorten(doc, true);
      docData.abstract = doc.abstract || false;
      docData.access = doc.access;
      // TODO: Needed for experimental; in template docData.kind is not same as doc.kind here, 
      //       so this is hack to provide doc.kind in template - we need to unify it
      docData.kindString = doc.kind;
      if(['get', 'set'].includes(doc.kind)) {
        docData.kind = doc.kind || false;
      }
      if(['member', 'method', 'get', 'set'].includes(doc.kind)) {
        docData.static = doc.static || false;
      }
      if(kindIcon) {
        docData.kindIcon = doc.interface ? 'interface' : doc.kind;
      } else {
        docData.kindIcon = false;
      }
      docData.since = doc.since || false;
      docData.deprecated = this._generateDeprecatedData(doc);
      docData.experimental = this._generateExperimentalData(doc);
      docData.version = doc.version || false;
      
      summaryData.docs.push(docData);
    }

    return summaryData;
  }
  
  /**
   * build summary output html by parent doc.
   * @param {DocObject} doc - parent doc object.
   * @param {string} kind - target kind property.
   * @param {string} title - summary title.
   * @param {boolean} [isStatic=true] - target static property.
   * @returns {string} html of summary.
   * @private
   */
  _buildSummaryHTML(doc, kind, title, isStatic = true) {
    const accessDocs = this._findAccessDocs(doc, kind, isStatic);
    let html = '';
    for (const accessDoc of accessDocs) {
      const docs = accessDoc[1];
      if (!docs.length) continue;

      let prefix = '';
      if (docs[0].static) prefix = 'Static ';
      const _title = `${prefix}${accessDoc[0]} ${title}`;

      const result = this._buildSummaryDoc(docs, _title);
      if (result) {
        html += result.html;
      }
    }

    return html;
  }

  /**
   * build summary output html by docs.
   * @param {DocObject[]} docs - target docs.
   * @param {string} title - summary title.
   * @param {boolean} innerLink - if true, link in summary is inner link.
   * @param {boolean} kindIcon - use kind icon.
   * @return {IceCap} summary output.
   * @protected
   */
  _buildSummaryDoc(docs, title, innerLink = false, kindIcon = false) {
    if (docs.length === 0) return null;

    const ice = new IceCap(this._readTemplate('summary.html'));

    ice.text('title', title);
    ice.loop('target', docs, (i, doc, ice2) => {
      ice2.text('generator', doc.generator ? '*' : '');
      ice2.text('async', doc.async ? 'async' : '');
      ice2.load('name', this._buildDocLinkHTML(doc.longname, null, innerLink, doc.kind));
      ice2.load('signature', this._buildSignatureHTML(doc));
      ice2.load('description', shorten(doc, true));
      ice2.text('abstract', doc.abstract ? 'abstract' : '');
      ice2.text('access', doc.access);
      if (['get', 'set'].includes(doc.kind)) {
        ice2.text('kind', doc.kind);
      } else {
        ice2.drop('kind');
      }

      if (['member', 'method', 'get', 'set'].includes(doc.kind)) {
        ice2.text('static', doc.static ? 'static' : '');
      } else {
        ice2.drop('static');
      }

      if (kindIcon) {
        const kind = doc.interface ? 'interface' : doc.kind;
        ice2.text('kind-icon', kind.charAt(0).toUpperCase());
        ice2.attr('kind-icon', 'class', `kind-${kind}`, IceCap.MODE_APPEND);
      } else {
        ice2.drop('kind-icon');
      }

      ice2.text('since', doc.since);
      ice2.load('deprecated', this._buildDeprecatedHTML(doc));
      ice2.load('experimental', this._buildExperimentalHTML(doc));
      ice2.text('version', doc.version);
    });

    return ice;
  }

  _generateDetailsData(doc, kind, title, isStatic = true) {
    const accessDocs = this._findAccessDocs(doc, kind, isStatic);
    const results = [];
    for(const accessDoc of accessDocs) {
      const docs = accessDoc[1];
      if(!docs.length) continue;
      let prefix = '';
      if(docs[0].static) prefix = 'Static ';
      const _title = `${prefix}${accessDoc[0]} ${title}`;
      const result = this._generateDetailsDocsData(docs, _title);
      results.push(result);
    }
    return results;
  }

  /**
   * build detail output html by parent doc.
   * @param {DocObject} doc - parent doc object.
   * @param {string} kind - target kind property.
   * @param {string} title - detail title.
   * @param {boolean} [isStatic=true] - target static property.
   * @returns {string} html of detail.
   * @private
   */
  _buildDetailHTML(doc, kind, title, isStatic = true) {
    const accessDocs = this._findAccessDocs(doc, kind, isStatic);
    let html = '';
    for (const accessDoc of accessDocs) {
      const docs = accessDoc[1];
      if (!docs.length) continue;

      let prefix = '';
      if (docs[0].static) prefix = 'Static ';
      const _title = `${prefix}${accessDoc[0]} ${title}`;

      const result = this._buildDetailDocs(docs, _title);
      if (result) html += result.html;
    }

    return html;
  }

  _generateDetailsDocsData(docs, title) {
    const detailsData = {};
    detailsData.title = (!docs.length) ? false : title;
    
    return detailsData;
  }

  /* eslint-disable max-statements */
  /**
   * build detail output html by docs.
   * @param {DocObject[]} docs - target docs.
   * @param {string} title - detail title.
   * @return {IceCap} detail output.
   * @private
   */
  _buildDetailDocs(docs, title) {
    const ice = new IceCap(this._readTemplate('details.html'));

    ice.text('title', title);
    ice.drop('title', !docs.length);

    ice.loop('detail', docs, (_1, doc, ice4) => {
      const scope = doc.static ? 'static' : 'instance';
      const anchorLink = `${scope}-${doc.kind}-${doc.name}${doc.anonymous ? `-${doc.__docId__}` : ''}`;
      ice4.attr('anchor', 'id', anchorLink);
      ice4.text('generator', doc.generator ? '*' : '');
      ice4.text('async', doc.async ? 'async' : '');
      ice4.text('name', doc.name);
      ice4.load('signature', this._buildSignatureHTML(doc));
      ice4.load('description', doc.description || this._buildOverrideMethodDescription(doc));
      ice4.text('abstract', doc.abstract ? 'abstract' : '');
      ice4.text('access', doc.access);
      if (['get', 'set'].includes(doc.kind)) {
        ice4.text('kind', doc.kind);
      } else {
        ice4.drop('kind');
      }
      if (doc.export && doc.importPath && doc.importStyle) {
        const link = this._buildFileDocLinkHTML(doc, doc.importPath);
        ice4.into('importPath', `${highlight(`import ${doc.importStyle} from`)} '${link}'`, (code, ice2) => {
          ice2.load('importPathCode', code);
        });
      } else {
        ice4.drop('importPath');
      }

      if (['member', 'method', 'get', 'set'].includes(doc.kind)) {
        ice4.text('static', doc.static ? 'static' : '');
      } else {
        ice4.drop('static');
      }

      ice4.load('source', this._buildFileDocLinkHTML(doc, 'source'));
      ice4.text('since', doc.since, 'append');
      ice4.load('deprecated', this._buildDeprecatedHTML(doc));
      ice4.load('experimental', this._buildExperimentalHTML(doc));
      ice4.text('version', doc.version, 'append');
      ice4.load('see', this._buildDocsLinkHTML(doc.see), 'append');
      ice4.load('todo', this._buildDocsLinkHTML(doc.todo), 'append');
      ice4.load('override', this._buildOverrideMethod(doc));
      ice4.load('decorator', this._buildDecoratorHTML(doc), 'append');

      let isFunction = false;
      if (['method', 'constructor', 'function'].indexOf(doc.kind) !== -1) isFunction = true;
      if (doc.kind === 'typedef' && doc.params && doc.type.types[0] === 'function') isFunction = true;

      if (isFunction) {
        ice4.load('properties', this._buildProperties(doc.params, 'Params:'));
      } else {
        ice4.load('properties', this._buildProperties(doc.properties, 'Properties:'));
      }

      // return
      if (doc.return) {
        ice4.load('returnDescription', doc.return.description);
        const typeNames = [];
        for (const typeName of doc.return.types) {
          typeNames.push(this._buildTypeDocLinkHTML(typeName));
        }
        if (typeof doc.return.nullable === 'boolean') {
          const nullable = doc.return.nullable;
          ice4.load('returnType', `${typeNames.join(' | ')} (nullable: ${nullable})`);
        } else {
          ice4.load('returnType', typeNames.join(' | '));
        }

        ice4.load('returnProperties', this._buildProperties(doc.properties, 'Return Properties:'));
      } else {
        ice4.drop('returnParams');
      }

      // throws
      if (doc.throws) {
        ice4.loop('throw', doc.throws, (_2, exceptionDoc, ice2) => {
          ice2.load('throwName', this._buildDocLinkHTML(exceptionDoc.types[0]));
          ice2.load('throwDesc', exceptionDoc.description);
        });
      } else {
        ice4.drop('throwWrap');
      }

      // fires
      if (doc.emits) {
        ice4.loop('emit', doc.emits, (_2, emitDoc, ice2) => {
          ice2.load('emitName', this._buildDocLinkHTML(emitDoc.types[0]));
          ice2.load('emitDesc', emitDoc.description);
        });
      } else {
        ice4.drop('emitWrap');
      }

      // listens
      if (doc.listens) {
        ice4.loop('listen', doc.listens, (_2, listenDoc, ice2) => {
          ice2.load('listenName', this._buildDocLinkHTML(listenDoc.types[0]));
          ice2.load('listenDesc', listenDoc.description);
        });
      } else {
        ice4.drop('listenWrap');
      }

      // example
      ice4.into('example', doc.examples, (examples, ice3) => {
        ice3.loop('exampleDoc', examples, (_2, exampleDoc, ice2) => {
          const parsed = parseExample(exampleDoc);
          ice2.text('exampleCode', parsed.body);
          ice2.text('exampleCaption', parsed.caption);
        });
      });

      // tests
      ice4.into('tests', doc._custom_tests, (tests, ice3) => {
        ice3.loop('test', tests, (_2, test, ice2) => {
          const testDoc = this._find({longname: test})[0];
          ice2.load('test', this._buildFileDocLinkHTML(testDoc, testDoc.testFullDescription));
        });
      });
    });

    return ice;
  }

  /**
   * get output html page title.
   * @param {DocObject} doc - target doc object.
   * @returns {string} page title.
   * @private
   */
  _getTitle(doc = '') {
    const name = doc.name || doc.toString();

    if (name) {
      return `${name}`;
    }
    
    return '';
  }

  /**
   * get base url html page. it is used html base tag.
   * @param {string} fileName - output file path.
   * @returns {string} base url.
   * @protected
   */
  _getBaseUrl(fileName) {
    const baseUrl = '../'.repeat(fileName.split('/').length - 1);
    return baseUrl;
  }

  /**
   * gat url of output html page.
   * @param {DocObject} doc - target doc object.
   * @returns {string} url of output html. it is relative path from output root dir.
   * @private
   */
  _getURL(doc) {
    let inner = false;
    if (['variable', 'function', 'member', 'typedef', 'method', 'constructor', 'get', 'set'].includes(doc.kind)) {
      inner = true;
    }

    if (inner) {
      const scope = doc.static ? 'static' : 'instance';
      const fileName = this._getOutputFileName(doc);
      if( doc.anonymous ) {
        return `${fileName}#${scope}-${doc.kind}-${doc.name}-${doc.__docId__}`;
      }
      return `${fileName}#${scope}-${doc.kind}-${doc.name}`;
    }
    
    const fileName = this._getOutputFileName(doc);
    return fileName;
  }

  /**
   * get file name of output html page.
   * @param {DocObject} doc - target doc object.
   * @returns {string} file name.
   * @private
   */
  _getOutputFileName(doc) {
    switch (doc.kind) {
      case 'variable':
        return 'variable/index.html';
      case 'function':
        return 'function/index.html';
      case 'member': // fall
      case 'method': // fall
      case 'constructor': // fall
      case 'set': // fall
      case 'get': { // fal
        const parentDoc = this._find({longname: doc.memberof})[0];
        return this._getOutputFileName(parentDoc);
      }
      case 'external':
        return 'external/index.html';
      case 'typedef':
        return 'typedef/index.html';
      case 'class':
        return `class/${doc.longname}.html`;
      case 'file':
        return `file/${doc.name}.html`;
      case 'testFile':
        return `test-file/${doc.name}.html`;
      case 'test':
        return 'test.html';
      default:
        throw new Error('DocBuilder: can not resolve file name.');
    }
  }
  
  /**
   * @param {*} doc 
   * @param {*} [text=null] 
   * @returns {false|{text:string, href:string}} 
   */
  _generateFileDocLinkData(doc, text = null) {
    if(!doc) return false;
    
    let fileDoc = null;
    if(doc.kind === 'file' || doc.kind === 'testFile') {
      fileDoc = doc;
    } else {
      const filePath = doc.longname.split('~')[0];
      fileDoc = this._find({kind: ['file', 'testFile'], name: filePath})[0];
    }

    if(!fileDoc) return false;
    if(!text) text = fileDoc.name;
    
    if(doc.kind === 'file' || doc.kind === 'testFile') {
      return {text: text, href: this._getURL(fileDoc)};
    }

    return {text: text, href: `${this._getURL(fileDoc)}#lineNumber${doc.lineNumber}`};
  }
  
  /**
   * build html link to file page.
   * @param {DocObject} doc - target doc object.
   * @param {string} text - link text.
   * @returns {string} html of link.
   * @private
   */
  _buildFileDocLinkHTML(doc, text = null) {
    if (!doc) return '';

    let fileDoc = null;
    if (doc.kind === 'file' || doc.kind === 'testFile') {
      fileDoc = doc;
    } else {
      const filePath = doc.longname.split('~')[0];
      fileDoc = this._find({kind: ['file', 'testFile'], name: filePath})[0];
    }

    if (!fileDoc) return '';

    if (!text) text = fileDoc.name;

    if (doc.kind === 'file' || doc.kind === 'testFile') {
      return `<span><a href="${this._getURL(fileDoc)}">${text}</a></span>`;
    }
    
    return `<span><a href="${this._getURL(fileDoc)}#lineNumber${doc.lineNumber}">${text}</a></span>`;
  }

  _generateTypeDocLinkData(typeName) {
    console.log('\x1b[38;5;73m','_generateTypeDocLinkData typeName', typeName, '\x1b[0m');
    let typeDocLinkData = {};

    // e.g. number[]
    let matched = typeName.match(/^(.*?)\[\]$/u);
    if(matched) {
      return {
        ...this._generateDocLinkData(matched[1], matched[1]),
      };
    }
    
    // e.g. function(a: number, b: string): boolean
    matched = typeName.match(/function *\((.*?)\)(.*)/u);
    if(matched) {
      if(!matched[1] && !matched[2]) return this._generateDocLinkData('function');
      console.log('\x1b[38;5;83m','    matched[1]', (matched[1]) ? matched[1] : 'false', '\x1b[0m');
      console.log('\x1b[38;5;83m','    matched[2]', (matched[2]) ? matched[2] : 'false', '\x1b[0m');
      return {text: typeName};
    }
    
    // e.g. {a: number, b: string}
    matched = typeName.match(/^\{(.*?)\}$/u);
    if(matched) {
      if(!matched[1]) return this._generateDocLinkData('{}');
      console.log('\x1b[38;5;83m','    matched[1]', (matched[1]) ? matched[1] : 'false', '\x1b[0m');
      console.log('\x1b[38;5;83m','    matched[2]', (matched[2]) ? matched[2] : 'false', '\x1b[0m');
      return {text: typeName};
    }

    // e.g. Map<number, string>
    matched = typeName.match(/^(.*?)\.?<(.*?)>$/u);
    if(matched) {
      console.log('\x1b[38;5;83m','    matched[1]', (matched[1]) ? matched[1] : 'false', '\x1b[0m');
      console.log('\x1b[38;5;83m','    matched[2]', (matched[2]) ? matched[2] : 'false', '\x1b[0m');
      return {text: typeName};
    }
    
    console.log('\x1b[38;5;83m','    typeName', typeName, '\x1b[0m');
    
    return {text: typeName};
  }
  
  /**
   * build html link of type.
   * @param {string} typeName - type name(e.g. ``number[]``, ``Map<number, string>``)
   * @returns {string} html of link.
   * @private
   * @todo re-implement with parser combinator.
   */
  _buildTypeDocLinkHTML(typeName) {
    // e.g. number[]
    let matched = typeName.match(/^(.*?)\[\]$/u);
    if (matched) {
      typeName = matched[1];
      return `<span>${this._buildDocLinkHTML(typeName, typeName)}<span>[]</span></span>`;
    }

    // e.g. function(a: number, b: string): boolean
    matched = typeName.match(/function *\((.*?)\)(.*)/u);
    if (matched) {
      const functionLink = this._buildDocLinkHTML('function');
      if (!matched[1] && !matched[2]) return `<span>${functionLink}<span>()</span></span>`;

      let innerTypes = [];
      if (matched[1]) {
        // bad hack: Map.<string, boolean> => Map.<string\Z boolean>
        // bad hack: {a: string, b: boolean} => {a\Y string\Z b\Y boolean}
        const inner = matched[1]
          .replace(/<.*?>/gu, (a) => { return a.replace(/,/gu, '\\Z'); })
          .replace(/\{.*?\}/gu, (a) => { return a.replace(/,/gu, '\\Z').replace(/:/gu, '\\Y'); });
        innerTypes = inner.split(',').map((v) => {
          const tmp = v.split(':').map((v2) => { return v2.trim(); });
          if (tmp.length !== 2) throw new SyntaxError(`Invalid function type annotation: \`${matched[0]}\``);

          const paramName = tmp[0];
          const typeName2 = tmp[1].replace(/\\Z/gu, ',').replace(/\\Y/gu, ':');
          return `${paramName}: ${this._buildTypeDocLinkHTML(typeName2)}`;
        });
      }

      let returnType = '';
      if (matched[2]) {
        const type = matched[2].split(':')[1];
        if (type) returnType = `: ${this._buildTypeDocLinkHTML(type.trim())}`;
      }

      return `<span>${functionLink}<span>(${innerTypes.join(', ')})</span>${returnType}</span>`;
    }

    // e.g. {a: number, b: string}
    matched = typeName.match(/^\{(.*?)\}$/u);
    if (matched) {
      if (!matched[1]) return '{}';

      // bad hack: Map.<string, boolean> => Map.<string\Z boolean>
      // bad hack: {a: string, b: boolean} => {a\Y string\Z b\Y boolean}
      const inner = matched[1]
        .replace(/<.*?>/gu, (a) => { return a.replace(/,/gu, '\\Z'); })
        .replace(/\{.*?\}/gu, (a) => { return a.replace(/,/gu, '\\Z').replace(/:/gu, '\\Y'); });

      let broken = false;

      const innerTypes = inner.split(',').map((v) => {
        const tmp = v.split(':').map((v2) => { return v2.trim(); });

        // edge case: if object key includes comma, this parsing is broken.
        // e.g. {"a,b": 10}
        // https://github.com/esdoc/esdoc-plugins/pull/49
        if (!tmp[0] || !tmp[1]) {
          broken = true;
          return '*';
        }

        const paramName = tmp[0];
        let typeName2 = tmp[1].replace(/\\Z/gu, ',').replace(/\\Y/gu, ':');
        if (typeName2.includes('|')) {
          typeName2 = typeName2.replace(/^\(/u, '').replace(/\)$/u, '');
          const typeNames = typeName.split('|').map((v2) => { return v2.trim(); });
          const html = [];
          for (const unionType of typeNames) {
            html.push(this._buildTypeDocLinkHTML(unionType));
          }
          return `${paramName}: ${html.join('|')}`;
        }
        
        return `${paramName}: ${this._buildTypeDocLinkHTML(typeName2)}`;
      });

      return `{${innerTypes.join(', ')}}`;
    }

    // e.g. Map<number, string>
    matched = typeName.match(/^(.*?)\.?<(.*?)>$/u);
    if (matched) {
      const mainType = matched[1];
      // bad hack: Map.<string, boolean> => Map.<string\Z boolean>
      // bad hack: {a: string, b: boolean} => {a\Y string\Z b\Y boolean}
      const inner = matched[2]
        .replace(/<.*?>/gu, (a) => { return a.replace(/,/gu, '\\Z'); })
        .replace(/\{.*?\}/gu, (a) => { return a.replace(/,/gu, '\\Z').replace(/:/gu, '\\Y'); });
      const innerTypes = inner.split(',').map((v) => {
        return v.split('|').map((vv) => {
          vv = vv.trim().replace(/\\Z/gu, ',').replace(/\\Y/gu, ':');
          return this._buildTypeDocLinkHTML(vv);
        }).join('|');
      });

      const html = `${this._buildDocLinkHTML(mainType, mainType)}<${innerTypes.join(', ')}>`;
      return html;
    }

    if (typeName.indexOf('...') === 0) {
      typeName = typeName.replace('...', '');
      if (typeName.includes('|')) {
        const typeNames = typeName.replace('(', '').replace(')', '').split('|');
        const typeLinks = typeNames.map((v) => { return this._buildDocLinkHTML(v); });
        return `...(${typeLinks.join('|')})`;
      }
      
      return `...${this._buildDocLinkHTML(typeName)}`;
    } else if (typeName.indexOf('?') === 0) {
      typeName = typeName.replace('?', '');
      return `?${this._buildDocLinkHTML(typeName)}`;
    }
    
    return this._buildDocLinkHTML(typeName);
  }
  
  /**
   * @param {string} longName 
   * @param {*} [text=null] 
   * @param {*} [inner=false] 
   * @param {*} [kind=null] 
   * @returns {{name:string,href:string|false}}
   */
  _generateDocLinkData(longName, text = null, inner = false, kind = null) {
    if(!longName) return {name:'', href: false};
    if(typeof longName !== 'string') {
      const errorText = `Error: _generateDocLinkData longName parameter is expected to be string!`;
      console.error(errorText);
      throw new Error(errorText);
    }

    const doc = this._findByName(longName, kind)[0];
    if(!doc) {
      return {name: sanitize(text || longName), href:false};
    }
    
    if(doc.kind === 'external') {
      return {name: sanitize(doc.name), href: doc.externalLink};
    }
    
    const url = this._getURL(doc, inner);
    if( url ) {
      return {name: sanitize(text || doc.name), href: url};
    }
    return {name: sanitize(text), href: false};
  }
  
  /**
   * build html link to identifier.
   * @param {string} longname - link to this.
   * @param {string} [text] - link text. default is name property of doc object.
   * @param {boolean} [inner=false] - if true, use inner link.
   * @param {string} [kind] - specify target kind property.
   * @returns {string} html of link.
   * @private
   */
  _buildDocLinkHTML(longname, text = null, inner = false, kind = null) {
    if (!longname) return '';

    if (typeof longname !== 'string') throw new Error(JSON.stringify(longname));

    const doc = this._findByName(longname, kind)[0];

    if (!doc) {
      // if longname is HTML tag, not escape.
      if (longname.indexOf('<') === 0) {
        return `<span>${longname}</span>`;
      }
      
      return `<span>${sanitize(text || longname)}</span>`;
    }

    if (doc.kind === 'external') {
      text = doc.name;
      return `<span><a href="${doc.externalLink}">${text}</a></span>`;
    }
    
    text = sanitize(text || doc.name);
    const url = this._getURL(doc, inner);
    if (url) {
      return `<span><a href="${url}">${text}</a></span>`;
    }
    
    return `<span>${text}</span>`;
  }
  
  _generateDocsLinkData(longnames, text = null, inner = false) {
    if(!longnames) return false;
    if(!longnames.length) return false;

    const links = [];
    for(const longname of longnames) {
      // TODO: this is weird check... maybe check if longname can be found should be here?
      if(!longname) continue;
      links.push(this._generateDocLinkData(longname, text, inner));
    }
    
    if(!links.length) return false;
    
    return links;
  }

  /**
   * build html links to identifiers
   * @param {string[]} longnames - link to these.
   * @param {string} [text] - link text. default is name property of doc object.
   * @param {boolean} [inner=false] - if true, use inner link.
   * @param {string} [separator='\n'] - used link separator.
   * @returns {string} html links.
   * @private
   */
  _buildDocsLinkHTML(longnames, text = null, inner = false, separator = '\n') {
    if (!longnames) return '';
    if (!longnames.length) return '';

    const links = [];
    for (const longname of longnames) {
      if (!longname) continue;
      const link = this._buildDocLinkHTML(longname, text, inner);
      links.push(`<li>${link}</li>`);
    }

    if (!links.length) return '';

    return `<ul>${links.join(separator)}</ul>`;
  }
  
  _generateSignatureData(doc) {
    if(!doc) {
      const errorText = 'Error: doc is a required parameter!';
      console.error(errorText);
      throw new TypeError(errorText);
    }

    const signatureData = { params: [], returns: [], types: [] };
    if(doc.params) {
      // Parameters
      for(const param of doc.params) {
        if(param.name.indexOf('.') !== -1) {
          // for object property
          console.log('\x1b[38;5;40m', 'param.name', param.name, '\x1b[0m');
          console.log('\x1b[38;5;40m', 'continuing with next', '\x1b[0m');
          continue;
        }
        if(param.name.indexOf('[') !== -1) {
          // for array property
          console.log('\x1b[38;5;40m', 'param.name', param.name, '\x1b[0m');
          console.log('\x1b[38;5;40m', 'continuing with next', '\x1b[0m');
          continue;
        }
        
        const types = [];
        for( const typeName of param.types ) {
          types.push(this._generateTypeDocLinkData(typeName));
        }

        signatureData.params.push(types);
      }
    } else {
      signatureData.params = false;
    }
    

    // return signature
    if(doc.return) {
      for(const typeName of doc.return.types) {
        signatureData.returns.push(this._generateTypeDocLinkData(typeName));
      }
    } else {
      signatureData.returns = false;
    }

    // type signature
    if(doc.type) {
      console.log('\x1b[38;5;22m', 'doc.type', doc.type, '\x1b[0m');
      for(const typeName of doc.type.types) {
        signatureData.types.push(this._generateTypeDocLinkData(typeName));
      }
    } else {
      signatureData.types = false;
    }

    // callback does not need types, because it has type of function?
    if(doc.kind === 'function') {
      console.log('\x1b[38;5;125m', 'kind is function, resetting types', '\x1b[0m');
      signatureData.types = false;
    }

    return signatureData;
  }
  
  /**
   * build identifier signature html.
   * @param {DocObject} doc - target doc object.
   * @returns {string} signature html.
   * @private
   */
  _buildSignatureHTML(doc) {
    // call signature
    const callSignatures = [];
    if (doc.params) {
      for (const param of doc.params) {
        const paramName = param.name;
        if (paramName.indexOf('.') !== -1) continue; // for object property
        if (paramName.indexOf('[') !== -1) continue; // for array property

        const types = [];
        for (const typeName of param.types) {
          types.push(this._buildTypeDocLinkHTML(typeName));
        }

        callSignatures.push(`${paramName}: ${types.join(' | ')}`);
      }
    }

    // return signature
    const returnSignatures = [];
    if (doc.return) {
      for (const typeName of doc.return.types) {
        returnSignatures.push(this._buildTypeDocLinkHTML(typeName));
      }
    }

    // type signature
    let typeSignatures = [];
    if (doc.type) {
      for (const typeName of doc.type.types) {
        typeSignatures.push(this._buildTypeDocLinkHTML(typeName));
      }
    }

    // callback is not need type. because type is always function.
    if (doc.kind === 'function') {
      typeSignatures = [];
    }

    let html = '';
    if (callSignatures.length) {
      html = `(${callSignatures.join(', ')})`;
    } else if (['function', 'method', 'constructor'].includes(doc.kind)) {
      html = '()';
    }
    if (returnSignatures.length) html = `${html}: ${returnSignatures.join(' | ')}`;
    if (typeSignatures.length) html = `${html}: ${typeSignatures.join(' | ')}`;

    return html;
  }

  /**
   * build properties output.
   * @param {ParsedParam[]} [properties=[]] - properties in doc object.
   * @param {string} title - output title.
   * @return {IceCap} built properties output.
   * @private
   */
  _buildProperties(properties = [], title = 'Properties:') {
    const ice = new IceCap(this._readTemplate('properties.html'));

    ice.text('title', title);

    ice.loop('property', properties, (i, prop, ice2) => {
      ice2.autoDrop = false;
      if( !prop.name ) {
          logger.w(`Property ${prop.types} is missing a name!`);
          prop.name = '(no name provided)';
      }
      ice2.attr('property', 'data-depth', prop.name.split('.').length - 1);
      ice2.text('name', prop.name);
      ice2.attr('name', 'data-depth', prop.name.split('.').length - 1);
      ice2.load('description', prop.description);

      const typeNames = [];
      for (const typeName of prop.types) {
        typeNames.push(this._buildTypeDocLinkHTML(typeName));
      }
      ice2.load('type', typeNames.join(' | '));

      // appendix
      const appendix = [];
      if (prop.optional) {
        appendix.push('<li>optional</li>');
      }
      if ('defaultValue' in prop) {
        appendix.push(`<li>default: ${prop.defaultValue}</li>`);
      }
      if (typeof prop.nullable === 'boolean') {
        appendix.push(`<li>nullable: ${prop.nullable}</li>`);
      }
      if (appendix.length) {
        ice2.load('appendix', `<ul>${appendix.join('\n')}</ul>`);
      } else {
        ice2.text('appendix', '');
      }
    });

    if (!properties || properties.length === 0) {
      ice.drop('properties');
    }

    return ice;
  }
  
  // TODO: Do we need this? It could be checked in template.
  _generateDeprecatedData(doc) {
    if(doc.deprecated) {
      return doc.deprecated;
    }
    return false;
  }
  
  /**
   * build deprecated html.
   * @param {DocObject} doc - target doc object.
   * @returns {string} if doc is not deprecated, returns empty.
   * @private
   */
  _buildDeprecatedHTML(doc) {
    if (doc.deprecated) {
      const deprecated = [`this ${doc.kind} was deprecated.`];
      if (typeof doc.deprecated === 'string') deprecated.push(doc.deprecated);
      return deprecated.join(' ');
    }
    
    return '';
  }
  
  // TODO: Do we need this? It could be checked in template.
  _generateExperimentalData(doc) {
    if(doc && doc.experimental) {
      return doc.experimental;
    }
    return false;
  }

  /**
   * build experimental html.
   * @param {DocObject} doc - target doc object.
   * @returns {string} if doc is not experimental, returns empty.
   * @private
   */
  _buildExperimentalHTML(doc) {
    if (doc.experimental) {
      const experimental = [`this ${doc.kind} is experimental.`];
      if (typeof doc.experimental === 'string') experimental.push(doc.experimental);
      return experimental.join(' ');
    }
    
    return '';
  }

  /**
   * build method of ancestor class link html.
   * @param {DocObject} doc - target doc object.
   * @returns {string} html link. if doc does not override ancestor method, returns empty.
   * @private
   */
  _buildOverrideMethod(doc) {
    const parentDoc = this._findByName(doc.memberof)[0];
    if (!parentDoc) return '';
    if (!parentDoc._custom_extends_chains) return '';

    const chains = [...parentDoc._custom_extends_chains].reverse();
    for (const longname of chains) {
      const superClassDoc = this._findByName(longname)[0];
      if (!superClassDoc) continue;

      const superMethodDoc = this._find({name: doc.name, memberof: superClassDoc.longname})[0];
      if (!superMethodDoc) continue;

      return this._buildDocLinkHTML(superMethodDoc.longname, `${superClassDoc.name}#${superMethodDoc.name}`, true);
    }

    return '';
  }
  
  _generateOverrideMethodData(doc) {
    const parentDoc = this._findByName(doc.memberof)[0];
    if(!parentDoc) return false;
    if(!parentDoc._custom_extends_chains) return '';

    const chains = [...parentDoc._custom_extends_chains].reverse();
    for(const longname of chains) {
      const superClassDoc = this._findByName(longname)[0];
      if(!superClassDoc) continue;

      const superMethodDoc = this._find({name: doc.name, memberof: superClassDoc.longname});
      if(!superMethodDoc) continue;
      return this._generateDocLinkData(superMethodDoc.longname, `${superClassDoc.name}#${superMethodDoc.name}`, true);
    }
    return '_generateOverrideMethodData';
  }

  /**
   * build method of ancestor class description.
   * @param {DocObject} doc - target doc object.
   * @returns {string} description. if doc does not override ancestor method, returns empty.
   * @private
   */
  _buildOverrideMethodDescription(doc) {
    const parentDoc = this._findByName(doc.memberof)[0];
    if (!parentDoc) return '';
    if (!parentDoc._custom_extends_chains) return '';

    const chains = [...parentDoc._custom_extends_chains].reverse();
    for (const longname of chains) {
      const superClassDoc = this._findByName(longname)[0];
      if (!superClassDoc) continue;

      const superMethodDoc = this._find({name: doc.name, memberof: superClassDoc.longname})[0];
      if (!superMethodDoc) continue;

      if (superMethodDoc.description) return superMethodDoc.description;
    }

    return '';
  }
  
  _generateOverrideMethodDescriptionData(doc) {
    const parentDoc = this._findByName(doc.memberof)[0];
    if(!parentDoc) return false;
    if(!parentDoc._custom_extends_chains) return false;

    const chains = [...parentDoc._custom_extends_chains].reverse();
    for(const longname of chains) {
      const superClassDoc = this._findByName(longname)[0];
      if(!superClassDoc) continue;

      const superMethodDoc = this._find({name: doc.name, memberof: superClassDoc.longname})[0];
      if(!superMethodDoc) continue;

      if(superMethodDoc.description) return superMethodDoc.description;
    }

    return false;
  }

  _buildDecoratorHTML(doc) {
    if (!doc.decorators) return '';

    const links = [];
    for (const decorator of doc.decorators) {
      const link = this._buildDocLinkHTML(decorator.name, decorator.name, false, 'function');
      if (decorator.arguments) {
        links.push(`<li>${link}${decorator.arguments}</li>`);
      } else {
        links.push(`<li>${link}</li>`);
      }
    }

    if (!links.length) return '';

    return `<ul>${links.join('\n')}</ul>`;
  }
  
  _generateDecoratorData(doc) {
    if(!doc.decorators) return false;

    const links = [];
    for(const decorator of doc.decorators) {
      links.push({
        link: this._generateDocLinkData(decorator.name, decorator.name, false, 'function'),
        arguments: decorator.arguments,
      });
    }

    return links;
  }

  // _buildAuthorHTML(doc, separator = '\n') {
  //  if (!doc.author) return '';
  //
  //  var html = [];
  //  for (var author of doc.author) {
  //    var matched = author.match(/(.*?) *<(.*?)>/);
  //    if (matched) {
  //      var name = matched[1];
  //      var link = matched[2];
  //      if (link.indexOf('http') === 0) {
  //        html.push(`<li><a href="${link}">${name}</a></li>`)
  //      } else {
  //        html.push(`<li><a href="mailto:${link}">${name}</a></li>`)
  //      }
  //    } else {
  //      html.push(`<li>${author}</li>`)
  //    }
  //  }
  //
  //  return `<ul>${html.join(separator)}</ul>`;
  // }
  
  /**
   * @private
   */
  _pluginInstance = null;

  /**
   * @returns {PublishHtmlPlugin}
   */
  get Plugin() {
    return this._pluginInstance;
  }
}
