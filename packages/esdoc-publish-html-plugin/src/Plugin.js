import path from 'path';
import {taffy} from 'taffydb';
import IceCap from '@enterthenamehere/ice-cap';
import DocBuilder from './Builder/DocBuilder';
import StaticFileBuilder from './Builder/StaticFileBuilder.js';
import IdentifiersDocBuilder from './Builder/IdentifiersDocBuilder.js';
import IndexDocBuilder from './Builder/IndexDocBuilder.js';
import ClassDocBuilder from './Builder/ClassDocBuilder.js';
import SingleDocBuilder from './Builder/SingleDocBuilder.js';
import FileDocBuilder from './Builder/FileDocBuilder.js';
import SearchIndexBuilder from './Builder/SearchIndexBuilder.js';
import SourceDocBuilder from './Builder/SourceDocBuilder.js';
import TestDocBuilder from './Builder/TestDocBuilder.js';
import TestFileDocBuilder from './Builder/TestFileDocBuilder.js';
import ManualDocBuilder from './Builder/ManualDocBuilder.js';

class PublishHtmlPlugin {
  /**
   * @type {string}
   * @private
   */
  _defaultTemplateDirectory = path.resolve(__dirname, './html-template/ESDoc-v2');

  /**
   * @type {string}
   * @private
   */
  _templateDirectory = '';
  
  /**
   * Returns path to HTML template directory from which to load files.
   * @type {string}
   */
  get TemplateDirectory() {
    return this._templateDirectory;
  }
  
  /**
   * @type {object}
   * @private
   */
  _templateConfig = {};

  /**
   * Returns object with settings loaded from HTML template's config.json file.
   * @type {object}
   */
  get TemplateConfig() {
    return this._templateConfig;
  }
  
  /**
   * @type {object}
   * @private
   */
  _option = {};

  /**
   * Returns object with settings user provided to this plugin.
   * @returns {object} PluginConfig
   */
  get Config() {
    return this._option;
  }
  
  /**
   * @type {object}
   * @private
   */
  _globalOption = {};

  /**
   * Returns object with settings user provided to ESDoc.
   * @type {object} GlobalConfig
   */
  get GlobalConfig() {
    return this._globalOption;
  }
  
  /**
   * @type {[DocObject]}
   * @private
   */
  _docs = [];
  
  /**
   * Returns array of DocObjects plugin receives from ESDoc.
   * @returns {[DocObject]}
   */
  get Docs() {
    return this._docs;
  }
  
  /**
   * Sets {@link this#Docs} and populates {@link this#Data}
   */
  set Docs(value) {
    this._docs = value;
    this._data = taffy(value);
  }
  
  /**
   * Alias for Docs
   */
  get Tags() {
    return this.Docs;
  }
  
  /**
   * @type {taffydb|null}
   * @private
   */
  _data = null;
  
  /**
   * Returns taffydb object populated with {this#Docs}
   * @returns {taffydb|null}
   */
  get Data() {
    return this._data;
  }
  
  /**
   * Returns `true` if user want's verbose logging
   */
  get Verbose() {
    return this.GlobalConfig?.verbose || false;
  }

  onHandleDocs(ev) {
    this.Docs = ev.data.docs;
  }

  onPublish(ev) {
    this._option = ev.data.option || {};
    this._globalOption = ev.data.globalOption || {};
    
    // Check for custom template
    if(Object.prototype.hasOwnProperty.call(this._option, 'template')) {
      if( typeof this._option.template !== 'string' ) {
        const errorText = `Error: template option for esdoc-publish-html-plugin is expected to be string!`;
        console.error(errorText);
        throw new Error(errorText);
      }
      const templateDirectory = path.resolve(__dirname, this._option.template);
      
      if(!ev.FileManager.isDirectory(templateDirectory)) {
        const errorText = `Error: Cannot find '${templateDirectory}' directory to load html template from! Please set esdoc-publish-html-plugin's template option to existing directory.`;
        console.error(errorText);
        throw new Error(errorText);
      }

      this._templateDirectory = templateDirectory;
    } else {
      this._templateDirectory = this._defaultTemplateDirectory;
    }

    this._templateConfig = JSON.parse(
      ev.FileManager.readFileContents(path.join(this.TemplateDirectory,'config.json'))
    );

    this._exec(ev.data.writeFile, ev.data.copyDir, ev.data.readFile);
  }

  _exec(writeFile, copyDir, readFile) {
    IceCap.debug = Boolean(this._option.debug);
    
    //bad hack: for other plugin uses builder.
    DocBuilder.createDefaultBuilder = () => {
      return new DocBuilder({pluginInstance: this});
    };
    
    let coverage = null;
    try {
      coverage = JSON.parse(readFile('coverage.json'));
    } catch (e) {
      // nothing
    }

    new IdentifiersDocBuilder({pluginInstance: this}).exec(writeFile, copyDir);
    new IndexDocBuilder({pluginInstance: this}).exec(writeFile, copyDir);
    new ClassDocBuilder({pluginInstance: this}).exec(writeFile, copyDir);
    new SingleDocBuilder({pluginInstance: this}).exec(writeFile, copyDir);
    new FileDocBuilder({pluginInstance: this}).exec(writeFile, copyDir);
    new StaticFileBuilder({pluginInstance: this}).exec(writeFile, copyDir);
    new SearchIndexBuilder({pluginInstance: this}).exec(writeFile, copyDir);
    new SourceDocBuilder({pluginInstance: this}).exec(writeFile, copyDir, coverage);
    new ManualDocBuilder({pluginInstance: this}).exec(writeFile, copyDir, readFile);

    const existTest = this.Tags.find((tag) => { return tag.kind.indexOf('test') === 0; });
    if (existTest) {
      new TestDocBuilder({pluginInstance: this}).exec(writeFile, copyDir);
      new TestFileDocBuilder({pluginInstance: this}).exec(writeFile, copyDir);
    }
  }
}

module.exports = new PublishHtmlPlugin();
