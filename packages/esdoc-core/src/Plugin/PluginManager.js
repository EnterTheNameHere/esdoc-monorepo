import path from 'path';
import { isDeepStrictEqual } from 'util';
import { FileManager } from '../Util/FileManager';

console.log('>>>> __filename', __filename);

/**
 * Plugin system for your plugin.
 */
class PluginManager {
  /**
   * create instance.
   */
  constructor() {
    this._plugins = null;
    /** @type {GlobalOptions} */
    this._globalOptions = null;
    /** @type {Map<string,PluginEntry} */
    this._pluginEntries = new Map();
  }

  /**
   * Sets ESDoc globalOptions (eg. debug, verbose) which will be passed to all plugins. Should be called before registering any plugin.
   * @param {GlobalOptions} globalOptions
   */
  setGlobalConfig( globalOptions ) {
    this._globalOptions = globalOptions;
  }

  /**
   * Returns all plugins registered with the PluginManager.
   * @returns {Map<string,PluginEntry>}
   */
  getPluginEntries() {
    return this._pluginEntries;
  }

  /**
   * Returns globalSettings set with PluginManager#setGlobalSettings or `null` if none was set.
   * @returns {GlobalOptions|null}
   */
  getGlobalOptions() {
    return this._globalOptions;
  }

  /**
   * Returns Map with plugin settings { name: string, option: object }, where name is name of package or path of plugin and option are options for that plugin.
   * @returns {Map<string,{name:string,option:object}>}
   */
  getPluginsConfigObjects() {
    return this._pluginsConfigObjects;
  }

  /**
   * Register ESDoc plugin. Expects object with `name` property, which is npm package name or path (absolute or relative) to file, and `option` property, which is object with settings.
   * @param {{name:string, option:Object}} pluginSettings 
   */
  registerPlugin( pluginSettings ) {
    if( !pluginSettings || typeof(pluginSettings.name) !== 'string' ) {
      console.error('PluginManager::registerPlugin - Plugin must have a name!', pluginSettings);
      return;
    }

    // Check if package name has package scope prefix. Required for replace ESDoc & run functionality.
    if( pluginSettings.name && typeof(pluginSettings.name) === 'string' ) {
      // Plugin name can be a file path, for these do not check for scopePrefix
      if( !pluginSettings.name.startsWith('.') && !pluginSettings.name.startsWith('/') )
      {
        // Check if name of package contains prefix, if not, add it...
        if( !pluginSettings.name.startsWith(this._globalOptions.packageScopePrefix) ) {
          pluginSettings.name = `${this._globalOptions.packageScopePrefix}/${pluginSettings.name}`;
        }
      }
    }
    
    let savedPluginEntry = this._pluginEntries.get(pluginSettings.name);
    if( !savedPluginEntry ) {
      this._pluginEntries.set(pluginSettings.name, {instance: null, settings: pluginSettings});
      savedPluginEntry = this._pluginEntries.get(pluginSettings.name);
    } else {
      return;
    }

    if( !isDeepStrictEqual( savedPluginEntry.settings.option, pluginSettings.option ) ) {
      console.warn(`PluginManager::registerPlugin - ${pluginSettings.name} is registered more than once, which itself is not an issue, but option is not equal, which might be an issue!`);
      console.warn('Current plugin option:\n', savedPluginEntry.settings.option, 'New option:\n', pluginSettings.option);
    }

    let pluginInstance = null;
    
    try {
      if( savedPluginEntry.settings.name.startsWith('.') || savedPluginEntry.settings.name.startsWith('/') ) {
        // plugin's name is path
        const filePath = path.resolve(savedPluginEntry.settings.name);
        pluginInstance = require(filePath);
      } else {
        // plugin's name is package
        module.paths.push('./node_modules');
        pluginInstance = require(savedPluginEntry.settings.name);
        module.paths.pop();
      }
    } catch (err) {
      console.error(`[31mError! Plugin named '[31;7m${savedPluginEntry.settings.name}[0m[31m' cannot be found!`);
      console.error(`Try running '[37;7mnpm install --save-dev ${savedPluginEntry.settings.name}[0m[31m' to install the plugin.[0m`);
      process.exit(1);
    }
    
    savedPluginEntry.instance = pluginInstance;

    // If plugin have onInitialize function, call it with options as argument.
    if(pluginInstance.onInitialize && pluginInstance.onInitialize instanceof Function) {
      pluginInstance.onInitialize(new PluginEvent({}, this), savedPluginEntry.settings.option, this._globalOptions);
    }
  }

  /**
   * initialize with plugin property.
   * @param {Array<{name: string, option: object}>} plugins - expect config.plugins property.
   * @param {string} scopePrefix - scope of packages (ie. @enterthenamehere), or empty string.
   */
  init(plugins = [], scopePrefix = '') {
    this.onHandlePlugins(plugins, scopePrefix);
  }

  /**
   * Executes function named `handlerName`, if exists, on all plugins.
   * @param {string} handlerName - handler name(e.g. onHandleCode)
   * @param {PluginEvent} ev - plugin event object.
   * @private
   */
  _execHandler(handlerName, ev) {
    for( const pluginName of this._pluginEntries.keys() ) {
      const pluginEntry = this._pluginEntries.get(pluginName);
      // We don't have control over handlerName
      const targetFunction = pluginEntry.instance[handlerName] || null;
      if( targetFunction && targetFunction instanceof Function ) {
        ev.data.option = pluginEntry.settings.option;
        ev.data.globalOption = this._globalOptions;
        targetFunction.call(pluginEntry.instance, ev);
      }
    }
  }

  /**
   * handle start.
   */
  onStart() {
    const ev = new PluginEvent({}, this);
    this._execHandler('onStart', ev);
  }

  /**
   * handle config.
   * @param {ESDocConfig} config - original esdoc config.
   * @returns {ESDocConfig} handled config.
   */
  onHandleConfig(config) {
    const ev = new PluginEvent({config}, this);
    this._execHandler('onHandleConfig', ev);
    return ev.data.config;
  }

  /**
   * handle code.
   * @param {string} code - original code.
   * @param {string} filePath - source code file path.
   * @returns {string} handled code.
   */
  onHandleCode(code, filePath) {
    const ev = new PluginEvent({code}, this);
    ev.data.filePath = filePath;
    this._execHandler('onHandleCode', ev);
    return ev.data.code;
  }

  /**
   * handle code parser.
   * @param {function(code: string)} parser - original js parser.
   * @param {object} parserOption - default babylon options.
   * @param {string} filePath - source code file path.
   * @param {string} code - original code.
   * @returns {{parser: function(code: string), parserOption: Object}} handled parser.
   */
  onHandleCodeParser(parser, parserOption, filePath, code) {
    const ev = new PluginEvent({}, this);
    ev.data = {parser, parserOption, filePath, code};
    this._execHandler('onHandleCodeParser', ev);
    return {parser: ev.data.parser, parserOption: ev.data.parserOption};
  }

  /**
   * handle AST.
   * @param {AST} ast - original ast.
   * @param {string} filePath - source code file path.
   * @param {string} code - original code.
   * @returns {AST} handled AST.
   */
  onHandleAST(ast, filePath, code) {
    const ev = new PluginEvent({ast}, this);
    ev.data.filePath = filePath;
    ev.data.code = code;
    this._execHandler('onHandleAST', ev);
    return ev.data.ast;
  }

  /**
   * handle docs.
   * @param {Object[]} docs - docs.
   * @returns {Object[]} handled docs.
   */
  onHandleDocs(docs) {
    const ev = new PluginEvent({docs}, this);
    this._execHandler('onHandleDocs', ev);
    return ev.data.docs;
  }

  /**
   * handle publish
   * @param {function(filePath: string, content: string)} writeFile - write content.
   * @param {function(srcPath: string, destPath: string)} copyDir - copy directory.
   * @param {function(filePath: string):string} readFile - read content.
   */
  onPublish(writeFile, copyDir, readFile) {
    const ev = new PluginEvent({}, this);

    // hack: fixme
    ev.data.writeFile = writeFile;
    ev.data.copyFile = copyDir;
    ev.data.copyDir = copyDir;
    ev.data.readFile = readFile;

    this._execHandler('onPublish', ev);
  }

  /**
   * handle content.
   * @param {string} content - original content.
   * @param {string} fileName - the fileName of the HTML file.
   * @returns {string} handled HTML.
   */
  onHandleContent(content, fileName) {
    const ev = new PluginEvent({content, fileName}, this);
    this._execHandler('onHandleContent', ev);
    return ev.data.content;
  }

  /**
   * handle complete
   */
  onComplete() {
    const ev = new PluginEvent({}, this);
    this._execHandler('onComplete', ev);
  }
}

/**
 * Plugin Event class.
 */
export class PluginEvent {
  /**
   * create instance.
   * @param {Object} data - event content.
   * @param {PluginManager} pluginManager - instance of PluginManager plugin can access.
   */
  constructor(data = {}, pluginManager) {
    this.data = copy(data);
    this._PluginManager = pluginManager;
  }

  /**
   * @type {FileManager}
   */
  get FileManager() {
      return FileManager;
  }
  
  /**
   * @type {PluginManager}
   * PluginManager instance to access ESDoc's plugin configuration.
   */
  get PluginManager() {
    return this._PluginManager;
  }
}

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Instance of Plugin class.
 */
export default new PluginManager();
