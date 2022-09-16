import IceCap from '@enterthenamehere/ice-cap';
import DocBuilder from './DocBuilder.js';
import {parseExample, highlight, isIterable, jsIdentifierRegExp} from './util.js';

/**
 * Class Output Builder class.
 */
export default class ClassDocBuilder extends DocBuilder {
  exec(writeFile) {
    const nav = this._renderTemplate('nav.ejs', this._generateNavData());

    const docs = this._find({kind: ['class']});
    for(const doc of docs) {
      const fileName = this._getOutputFileName(doc);
      const baseUrl = this._getBaseUrl(fileName);
      const title = this._getTitle(doc);
      const contents = this._renderTemplate('class.ejs', {cls: this._generateClassDocData(doc)});
      writeFile(fileName, this._renderTemplate('layout.ejs', {nav, title, baseUrl, contents, esdocVersion:null, esdocLink:null}));
    }
  }

  exec_old(writeFile) {
    const ice = this._buildLayoutDoc();
    ice.autoDrop = false;
    const docs = this._find({kind: ['class']});
    for (const doc of docs) {
      const fileName = this._getOutputFileName(doc);
      const baseUrl = this._getBaseUrl(fileName);
      const title = this._getTitle(doc);
      ice.load('content', this._buildClassDoc(doc), IceCap.MODE_WRITE);
      ice.attr('baseUrl', 'href', baseUrl, IceCap.MODE_WRITE);
      ice.text('title', title, IceCap.MODE_WRITE);
      writeFile(fileName, ice.html);
    }
  }
  
  _generateClassDocData(doc) {
    if(!doc) {
      const errorText = `Error: _generateClassDocData 'doc' param is required!`;
      console.error(errorText);
      throw new Error(errorText);
    }
    
    const classData = {
      extendsData: this._generateExpressionExtendsData(doc),
      mixinClassesData: this._generateMixinClassesData(doc),
      extendsChainData: this._generateExtendsChainData(doc),
      directSubclassData: this._generateDirectSubclassData(doc),
      indirectSubclassData: this._generateIndirectSubclassData(doc),
    };
    if(doc.export && doc.importPath && doc.importStyle) {
      classData.sourceLink = this._generateFileDocLinkData(doc, doc.importPath);
      classData.importString = `import ${doc.importStyle} from`;
    }
    classData.access = doc.access || false;
    classData.kind = doc.interface ? 'interface' : 'class';
    classData.sourceFileLink = this._generateFileDocLinkData(doc, 'source');
    classData.since = doc.since || false;
    classData.version = doc.version || false;
    classData.variation = this._generateVariationData(doc);
    if(classData.variation) console.log('\x1b[38;5;17m', 'classData.variation', classData.variation, '\x1b[0m');

    classData.implementsData = this._generateDocsLinkData(doc.implements, null, false, ', ');
    classData.indirectImplementsData = this._generateDocsLinkData(doc._custom_indirect_implements, null, false, ', ');
    classData.directImplementedData = this._generateDocsLinkData(doc._custom_direct_implemented, null, false, ', ');
    classData.indirectImplementedData = this._generateDocsLinkData(doc._custom_indirect_implemented, null, false, ', ');

    classData.name = doc.name || false;
    classData.description = doc.description || false;
    classData.deprecated = this._generateDeprecatedData(doc);
    classData.experimental = this._generateExperimentalData(doc);
    classData.seeData = this._generateDocsLinkData(doc.see);
    classData.todoData = this._generateDocsLinkData(doc.todo);
    classData.decoratorData = this._generateDecoratorData(doc);

    const instanceDocs = this._find({kind: 'variable'}).filter((variable) => {
      return variable?.type?.types?.includes(doc.longname) || false;
    });
    
    classData.instancesData = [];
    if(isIterable(instanceDocs)) {
      for(const instanceDoc of instanceDocs) {
        classData.instancesData.push(this._generateDocLinkData(instanceDoc.longname));
      }
    }

    classData.examplesData = [];
    if(isIterable(doc.examples)) {
      for(const example of doc.examples) {
        const parsed = parseExample(example);
        classData.examplesData.push({code: parsed.body, caption: parsed.caption});
      }
    }

    classData.testsData = [];
    if(isIterable(doc._custom_tests)) {
      for(const test of doc._custom_tests) {
        const testDoc = this._find({longname: test})[0];
        classData.testsData.push(this._generateFileDocLinkData(testDoc, testDoc.testFullDescription));
      }
    }
    
    classData.staticMemberSummaryData = this._generateSummaryData(doc, 'member', 'Members', true);
    classData.staticMethodSummaryData = this._generateSummaryData(doc, 'method', 'Methods', true);
    classData.constructorSummaryData = this._generateSummaryData(doc, 'constructor', 'Constructor', false);
    classData.membersSummaryData = this._generateSummaryData(doc, 'member', 'Members', false);
    classData.methodsSummaryData = this._generateSummaryData(doc, 'method', 'Methods', false);
    
    classData.inheritedSummaryData = this._generateInheritedSummaryData(doc);
    
    classData.staticMemberDetailsData = this._generateDetailsData(doc, 'member', 'Members', true);
    classData.staticMethodDetailsData = this._generateDetailsData(doc, 'method', 'Methods', true);
    classData.constructorDetailsData = this._generateDetailsData(doc, 'constructor', 'Constructor', false);
    classData.membersDetailsData = this._generateDetailsData(doc, 'member', 'Members', false);
    classData.methodsDetailsData = this._generateDetailsData(doc, 'method', 'Methods', false);

    return classData;
  }

  /**
   * build class output.
   * @param {DocObject} doc - class doc object.
   * @returns {IceCap} built output.
   * @private
   */
  _buildClassDoc(doc) {
    const expressionExtends = this._buildExpressionExtendsHTML(doc);
    const mixinClasses = this._buildMixinClassesHTML(doc);
    const extendsChain = this._buildExtendsChainHTML(doc);
    const directSubclass = this._buildDirectSubclassHTML(doc);
    const indirectSubclass = this._buildIndirectSubclassHTML(doc);
    const instanceDocs = this._find({kind: 'variable'}).filter((v) => {
      return v.type && v.type.types.includes(doc.longname);
    });

    const ice = new IceCap(this._readTemplate('class.html'));

    // header
    if (doc.export && doc.importPath && doc.importStyle) {
      const link = this._buildFileDocLinkHTML(doc, doc.importPath);
      ice.into('importPath', `${highlight(`import ${doc.importStyle} from`)} '${link}'`, (code, ice2) => {
        ice2.load('importPathCode', code);
      });
    }
    ice.text('access', doc.access);
    ice.text('kind', doc.interface ? 'interface' : 'class');
    ice.load('source', this._buildFileDocLinkHTML(doc, 'source'), 'append');
    ice.text('since', doc.since, 'append');
    ice.text('version', doc.version, 'append');
    ice.load('variation', this._buildVariationHTML(doc), 'append');

    ice.into('expressionExtends', expressionExtends, (expressionExtends2, ice3) => { return ice3.load('expressionExtendsCode', expressionExtends2); });
    ice.load('mixinExtends', mixinClasses, 'append');
    ice.load('extendsChain', extendsChain, 'append');
    ice.load('directSubclass', directSubclass, 'append');
    ice.load('indirectSubclass', indirectSubclass, 'append');
    ice.load('implements', this._buildDocsLinkHTML(doc.implements, null, false, ', '), 'append');
    ice.load('indirectImplements', this._buildDocsLinkHTML(doc._custom_indirect_implements, null, false, ', '), 'append');
    ice.load('directImplemented', this._buildDocsLinkHTML(doc._custom_direct_implemented, null, false, ', '), 'append');
    ice.load('indirectImplemented', this._buildDocsLinkHTML(doc._custom_indirect_implemented, null, false, ', '), 'append');

    // self
    ice.text('name', doc.name);
    ice.load('description', doc.description);
    ice.load('deprecated', this._buildDeprecatedHTML(doc));
    ice.load('experimental', this._buildExperimentalHTML(doc));
    ice.load('see', this._buildDocsLinkHTML(doc.see), 'append');
    ice.load('todo', this._buildDocsLinkHTML(doc.todo), 'append');
    ice.load('decorator', this._buildDecoratorHTML(doc), 'append');

    ice.into('instanceDocs', instanceDocs, (instanceDocs2, ice2) => {
      ice2.loop('instanceDoc', instanceDocs2, (i, instanceDoc, ice3) => {
        ice3.load('instanceDoc', this._buildDocLinkHTML(instanceDoc.longname));
      });
    });

    ice.into('exampleDocs', doc.examples, (examples, ice2) => {
      ice2.loop('exampleDoc', examples, (i, example, ice3) => {
        const parsed = parseExample(example);
        ice3.load('exampleCode', parsed.body);
        ice3.text('exampleCaption', parsed.caption);
      });
    });

    ice.into('tests', doc._custom_tests, (tests, ice2) => {
      ice2.loop('test', tests, (i, test, ice3) => {
        const testDoc = this._find({longname: test})[0];
        ice3.load('test', this._buildFileDocLinkHTML(testDoc, testDoc.testFullDescription));
      });
    });

    // summary
    ice.load('staticMemberSummary', this._buildSummaryHTML(doc, 'member', 'Members', true));
    ice.load('staticMethodSummary', this._buildSummaryHTML(doc, 'method', 'Methods', true));
    ice.load('constructorSummary', this._buildSummaryHTML(doc, 'constructor', 'Constructor', false));
    ice.load('memberSummary', this._buildSummaryHTML(doc, 'member', 'Members', false));
    ice.load('methodSummary', this._buildSummaryHTML(doc, 'method', 'Methods', false));

    ice.load('inheritedSummary', this._buildInheritedSummaryHTML(doc), 'append');

    // detail
    ice.load('staticMemberDetails', this._buildDetailHTML(doc, 'member', 'Members', true));
    ice.load('staticMethodDetails', this._buildDetailHTML(doc, 'method', 'Methods', true));
    ice.load('constructorDetails', this._buildDetailHTML(doc, 'constructor', 'Constructors', false));
    ice.load('memberDetails', this._buildDetailHTML(doc, 'member', 'Members', false));
    ice.load('methodDetails', this._buildDetailHTML(doc, 'method', 'Methods', false));

    return ice;
  }
  
  _generateVariationData(doc) {
    const links = [];
    const variationDocs = this._find({memberof: doc.memberof, name: doc.name});
    for(const variationDoc of variationDocs) {
      if(variationDoc.variation === doc.variation) continue;
      links.push(this._generateDocLinkData(variationDoc.longname, `(${variationDoc.variation || 1})`));
    }
    if(links.length === 0) return false;
    return links;
  }

  /**
   * build variation of doc.
   * @param {DocObject} doc - target doc object.
   * @returns {string} variation links html.
   * @private
   * @experimental
   */
  _buildVariationHTML(doc) {
    const variationDocs = this._find({memberof: doc.memberof, name: doc.name});
    const html = [];
    for (const variationDoc of variationDocs) {
      if (variationDoc.variation === doc.variation) continue;

      html.push(this._buildDocLinkHTML(variationDoc.longname, `(${variationDoc.variation || 1})`));
    }

    return html.join(', ');
  }
  
  _generateMixinClassesData(doc) {
    if(!doc.extends) return false;
    if(doc.extends.length <= 1) return false;
    
    const links = [];
    for(const longname of doc.extends) {
      links.push(this._generateDocLinkData(longname));
    }

    return links;
  }

  /**
   * build mixin extends html.
   * @param {DocObject} doc - target class doc.
   * @return {string} mixin extends html.
   */
  _buildMixinClassesHTML(doc) {
    if (!doc.extends) return '';
    if (doc.extends.length <= 1) return '';

    const links = [];
    for (const longname of doc.extends) {
      links.push(this._buildDocLinkHTML(longname));
    }

    return `<div>${links.join(', ')}</div>`;
  }

  _generateExpressionExtendsData(doc) {
    if(!doc.expressionExtends) return false;
    
    const links = [];
    
    for(const match of doc.expressionExtends.match(jsIdentifierRegExp)) {
      links.push(this._generateDocLinkData(match));
    }
    
    return {expression: doc.expressionExtends, links: links};
  }

  /**
   * build expression extends html.
   * @param {DocObject} doc - target class doc.
   * @return {string} expression extends html.
   */
  _buildExpressionExtendsHTML(doc) {
    if (!doc.expressionExtends) return '';

    const html = doc.expressionExtends.replace(/[A-Z_$][a-zA-Z0-9_$]*/gu, (v) => {
      return this._buildDocLinkHTML(v);
    });

    return `class ${doc.name} extends ${html}`;
  }

  _generateExtendsChainData(doc) {
    if(!doc._custom_extends_chains) return false;
    if(doc.extends.length > 1) return false;

    const links = [];
    for(const longname of doc._custom_extends_chains) {
      links.push(this._generateDocLinkData(longname));
    }
    links.push(doc.name);

    return links;
  }

  /**
   * build class ancestor extends chain.
   * @param {DocObject} doc - target class doc.
   * @returns {string} extends chain links html.
   * @private
   */
  _buildExtendsChainHTML(doc) {
    if (!doc._custom_extends_chains) return '';
    if (doc.extends.length > 1) return '';

    const links = [];
    for (const longname of doc._custom_extends_chains) {
      links.push(this._buildDocLinkHTML(longname));
    }

    links.push(doc.name);

    return `<div>${links.join(' → ')}</div>`;
  }

  _generateIndirectSubclassData(doc) {
    if(!doc._custom_indirect_subclasses) return false;
    
    const links = [];
    for(const longname of doc._custom_indirect_subclasses) {
      links.push(this._generateDocLinkData(longname));
    }
    
    return links;
  }

  /**
   * build in-direct subclass list.
   * @param {DocObject} doc - target class doc.
   * @returns {string} html of in-direct subclass links.
   * @private
   */
  _buildIndirectSubclassHTML(doc) {
    if (!doc._custom_indirect_subclasses) return '';

    const links = [];
    for (const longname of doc._custom_indirect_subclasses) {
      links.push(this._buildDocLinkHTML(longname));
    }

    return `<div>${links.join(', ')}</div>`;
  }

  _generateDirectSubclassData(doc) {
    if(!doc._custom_direct_subclasses) return false;

    const links = [];
    for(const longname of doc._custom_direct_subclasses) {
      links.push(this._generateDocLinkData(longname));
    }
    
    return links;
  }

  /**
   * build direct subclass list.
   * @param {DocObject} doc - target class doc.
   * @returns {string} html of direct subclass links.
   * @private
   */
  _buildDirectSubclassHTML(doc) {
    if (!doc._custom_direct_subclasses) return '';

    const links = [];
    for (const longname of doc._custom_direct_subclasses) {
      links.push(this._buildDocLinkHTML(longname));
    }

    return `<div>${links.join(', ')}</div>`;
  }
  
  _generateInheritedSummaryData(doc) {
    if(['class', 'interface'].indexOf(doc.kind) === -1) return false;
    const results = [];

    const longnames = [
      ...doc._custom_extends_chains || []
    ];

    for(const longname of longnames) {
      const superDoc = this._find({longname})[0];
      if(!superDoc) continue;
      const targetDocs = this._find({memberof: longname, kind: ['member', 'method', 'get', 'set']});
      
      // TODO: allow custom sorting in HTML template
      targetDocs.sort((a, b) => {
        if(a.static !== b.static) {
          return -(a.static - b.static);
        }

        let order = {get: 0, set: 0, member: 1, method: 2};
        if(order[a.kind] !== order[b.kind]) {
          return order[a.kind] - order[b.kind];
        }

        order = {public: 0, protected: 1, private: 2};
        if(a.access !== b.access) {
          return order[a.access] - order[b.access];
        }
        
        if(a.name !== b.name) {
          return a.name < b.name ? -1 : 1;
        }
        
        order = {get: 0, set: 1, member: 2};
        return order[a.kind] - order[b.kind];
      });
      
      results.push({
        kind: superDoc.kind,
        link: this._generateDocLinkData(longname, superDoc.name),
        summary: this._generateSummaryDocData(targetDocs, '----------'),
      });
    }
    
    return results;
  }

  /**
   * build inherited method/member summary.
   * @param {DocObject} doc - target class doc.
   * @returns {string} html of inherited method/member from ancestor classes.
   * @private
   */
  _buildInheritedSummaryHTML(doc) {
    if (['class', 'interface'].indexOf(doc.kind) === -1) return '';

    const longnames = [
      ...doc._custom_extends_chains || []
      // ...doc.implements || [],
      // ...doc._custom_indirect_implements || [],
    ];

    const html = [];
    for (const longname of longnames) {
      const superDoc = this._find({longname})[0];

      if (!superDoc) continue;

      const targetDocs = this._find({memberof: longname, kind: ['member', 'method', 'get', 'set']});

      targetDocs.sort((a, b) => {
        if (a.static !== b.static) return -(a.static - b.static);

        let order = {get: 0, set: 0, member: 1, method: 2};
        if (order[a.kind] !== order[b.kind]) {
          return order[a.kind] - order[b.kind];
        }

        order = {public: 0, protected: 1, private: 2};
        if (a.access !== b.access) return order[a.access] - order[b.access];

        if (a.name !== b.name) return a.name < b.name ? -1 : 1;

        order = {get: 0, set: 1, member: 2};
        return order[a.kind] - order[b.kind];
      });

      const title = `<span class="toggle closed"></span> From ${superDoc.kind} ${this._buildDocLinkHTML(longname, superDoc.name)}`;
      const result = this._buildSummaryDoc(targetDocs, '----------');
      if (result) {
        result.load('title', title, IceCap.MODE_WRITE);
        html.push(result.html);
      }
    }

    return html.join('\n');
  }
}
