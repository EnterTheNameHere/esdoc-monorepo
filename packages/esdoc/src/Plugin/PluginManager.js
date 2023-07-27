import upath from 'upath';
import fse from 'fs-extra';
import { isDeepStrictEqual } from 'util';
import { FileManager } from '../Util/FileManager';

const _ = require('lodash');

const debugModule = require('debug');
const debug = debugModule('ESDoc:PluginManager');

/**
 * @typedef  {object} Plugin
 * @property {(event: PluginEvent, pluginOptions: PluginOptions, globalOptions: GlobalOptions)=>void|undefined} onInitialize
 * @property {(event: PluginEvent)=>void|undefined} onStart
 * @property {(event: PluginEvent)=>void|undefined} onHandleConfig
 * @property {(event: PluginEvent)=>void|undefined} onHandleCode
 * @property {(event: PluginEvent)=>void|undefined} onHandleCodeParser
 * @property {(event: PluginEvent)=>void|undefined} onHandleAST
 * @property {(event: PluginEvent)=>void|undefined} onHandleDocs
 * @property {(event: PluginEvent)=>void|undefined} onPublish
 * @property {(event: PluginEvent)=>void|undefined} onHandleContent
 * @property {(event: PluginEvent)=>void|undefined} onComplete
 */

/**
 * Represents entry of an ESDoc Plugin in PluginManager.
 */
class PluginEntry {
  /**
   * 
   * @param {string}        pluginNameOrPath
   * @param {PluginOptions} pluginOptions - if not provided, will be empty object.
   */
  constructor(pluginNameOrPath, pluginOptions = {}) {
    /**
     * If null, plugin wasn't instantiated yet.
     * @type {Plugin|null}
     */
    this._instance = null;
    /**
     * @type {string}
     */
    this._name = pluginNameOrPath;
    /**
     * If no options were provided, it will be empty object.
     * @type {PluginOptions}
     */
    this._pluginOptions = pluginOptions ?? {};
    /**
     * When instantiated, it will hold an absolute path to the instantiated file.
     * @type {PathLike|null}
     */
    this._filePath = null;
  }
  
  /**
   * @returns {Plugin}
   */
  get instance() {
    return this._instance;
  }
  
  /**
   * @param {Plugin}
   */
  set instance(value) {
    this._instance = value;
  }
  
  /**
   * @returns {string}
   */
  get name() {
    return this._name;
  }
  
  /**
   * @returns {object}
   */
  get pluginOptions() {
    return this._pluginOptions;
  }
  
  /**
   * When instantiated, it will hold an absolute path to the instantiated file or `null` when not instantiated.
   * @returns {PathLike|null}
   */
  get filePath() {
    return this._filePath;
  }

  /**
   * @param {PathLike} value
   */
  set filePath(value) {
    this._filePath = value;
  }
}

/**
 * Plugin system for your plugin.
 */
class PluginManager {
  /**
   * create instance.
   */
  constructor() {
    /** @type {GlobalOptions} */
    this._globalOptions = null;
    /** @type {Map<string,PluginEntry} */
    this._pluginEntries = new Map();
    /**
     * Holds additional "node_modules" directories we found when instantiating plugin instances. NPM (version 8 at this moment)
     * in global mode installation won't find plugins installed as sub-dependencies of other plugins:
     * 
     *     global node_modules:
     *         esdoc
     *         esdoc-standard-plugin
     *              node_modules/esdoc-publish-html-plugin
     * 
     * plugins: {name: 'esdoc-publish-html-plugin'}
     *     
     *     global node_modules:
     *         esdoc <- is doing the require
     *         esdoc-standard-plugin <- can be found by esdoc
     *             node_modules/esdoc-publish-html-plugin <- cannot be found by esdoc
     * 
     * We will add esdoc-standard-plugin's "node_modules" directory as additional directory, so when plugin is not
     * found we can then try to require html-publish-html-plugin directly from that directory.
     * 
     * @type {Array<PathLike>}
     */
    this._additionalNodeModulesDirectoriesForRequire = [];
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
  
  #instantiatePlugin() {

  }

  /**
   * Register ESDoc plugin.
   * 
   * `pluginNameOrPath` must be either package name, eg. what you write to require("package-here") or a relative/absolute path to javascript file.
   * `pluginOptions` can be an object with options plugin can be configured with as properties. Default is empty object.
   * 
   * @note Path resolution is left on node.js first. This works with npm local installation without any issues thanks to deduping. However if packages
   * are installed globally, npm have issue finding sub-dependencies so plugins installed by other plugins won't work as expected, eg: esdoc-standard-plugin
   * will install multiple plugins, but esdoc package will not be able to find them, since they are not deduped when installed globally.
   * If package cannot be found, we will try to look inside plugin's node_modules directory, if exists, for the plugin. If plugin cannot be found, error will
   * be thrown.
   * 
   * @param {string} pluginNameOrPath
   * @param {object} [pluginOptions] - defaults to empty object
   */
  registerPlugin(pluginNameOrPath, pluginOptions) {
    debug('#registerPlugin: Registering plugin %o with options:\n%O', pluginNameOrPath, pluginOptions);
    
    if(!pluginNameOrPath || typeof(pluginNameOrPath) !== 'string' || pluginNameOrPath.trim().length === 0) {
      throw new Error('PluginManager#registerPlugin: parameter pluginNameOrPath must be a string and it cannot be empty!');
    }
    
    let _pluginNameOrPath = pluginNameOrPath.trim();
    const _pluginOptions = pluginOptions ?? {};
    
    // Plugin name can be a file path, for these do not check for scopePrefix
    if( !_pluginNameOrPath.startsWith('.') && !_pluginNameOrPath.startsWith('/') )
    {
      // Check if name of package contains prefix, if not, add it...
      if( !_pluginNameOrPath.startsWith(this._globalOptions.packageScopePrefix) ) {
        _pluginNameOrPath = `${this._globalOptions.packageScopePrefix}/${_pluginNameOrPath}`;
      }
    }
    
    let savedPluginEntry = this._pluginEntries.get(_pluginNameOrPath);
    if( !savedPluginEntry ) {
      debug('Creating new PluginEntry for plugin named: %o with options:\n%O', _pluginNameOrPath, _pluginOptions);
      this._pluginEntries.set(_pluginNameOrPath, new PluginEntry(_pluginNameOrPath, _pluginOptions));
      savedPluginEntry = this._pluginEntries.get(_pluginNameOrPath);
    } else {
      return;
    }
    
    if( !isDeepStrictEqual( savedPluginEntry.pluginOptions, _pluginOptions ) ) {
      console.warn(`PluginManager::registerPlugin - ${_pluginNameOrPath} is registered more than once, which itself is not an issue, but option is not equal, which might be an issue!`);
      console.warn('Current plugin option:\n', savedPluginEntry.pluginOptions, 'New option:\n', _pluginOptions);
    }
    
    let pluginInstance = null;
    let filePath = null;
    let nodeJsListOfRequireDirectories = null;
    
    try {
      debug('About to instantiate plugin %o', savedPluginEntry.name);
      if( savedPluginEntry.name.startsWith('.') || savedPluginEntry.name.startsWith('/') ) {
        // plugin's name is path
        filePath = upath.resolve(savedPluginEntry.name);
        
        debug('Instantiating plugin as a path: %o', filePath);
        
        try {
          debug('Requiring plugin...');
          pluginInstance = require(filePath);
          filePath = require.resolve(filePath);
          nodeJsListOfRequireDirectories = require.resolve.paths(filePath);
        } catch(err) {
          debug('Instantiating failed %o', filePath);
          throw err;
        }
        
        debug('Finished...');
      } else {
        // plugin's name is package
        debug('Instantiating plugin as a package name: %o', savedPluginEntry.name);
        
        try {
          debug('Requiring plugin...');
          pluginInstance = require(savedPluginEntry.name);
          filePath = require.resolve(savedPluginEntry.name);
          nodeJsListOfRequireDirectories = require.resolve.paths(filePath);
        } catch(err) {
          debug('Instantiating failed %o', savedPluginEntry.name);
          throw err;
        }
        
        debug('Finished...');
      }
    } catch (err) {
      if(err.code === 'MODULE_NOT_FOUND') {
        // Node.js didn't found the plugin, so now let's take it into our hands and check additional node_modules folders from instantiated plugins...
        this._additionalNodeModulesDirectoriesForRequire.some((directory) => {
          try {
            const directoryToCheck = upath.resolve(directory, savedPluginEntry.name);
            debug('Checking directory %o for plugin %o', directoryToCheck, savedPluginEntry.name);
            debug('Requiring plugin...');
            pluginInstance = require(directoryToCheck);
            filePath = require.resolve(directoryToCheck);
            nodeJsListOfRequireDirectories = require.resolve.paths(directoryToCheck);
            return true;
          } catch (ourRequireErr) {
            if(ourRequireErr.code === 'MODULE_NOT_FOUND') {
              debug('Plugin not found here...');
              return false;
            }
            
            debug('Instantiating failed %o', savedPluginEntry.name);
            debug('err: %O', ourRequireErr);
            console.error(`[31mError! Plugin named '[31;7m${savedPluginEntry.name}[0m[31m' cannot be found!`);
            console.error(`Try running '[37;7mnpm install --save-dev ${savedPluginEntry.name}[0m[31m' to install the plugin.[0m`);
            process.exit(1);
            return false; // TODO: Refactor to better code
          }
        });
        
        if(!pluginInstance) {
          console.error(`[31mError! Plugin named '[31;7m${savedPluginEntry.name}[0m[31m' cannot be found!`);
          console.error(`Try running '[37;7mnpm install --save-dev ${savedPluginEntry.name}[0m[31m' to install the plugin.[0m`);
          process.exit(1);
        }
      } else {
        debug('err: %O', err);
        console.error(`[31mError! Plugin named '[31;7m${savedPluginEntry.name}[0m[31m' cannot be found!`);
        console.error(`Try running '[37;7mnpm install --save-dev ${savedPluginEntry.name}[0m[31m' to install the plugin.[0m`);
        process.exit(1);
      }
    }
    
    savedPluginEntry.instance = pluginInstance;
    savedPluginEntry.filePath = filePath;
    if(savedPluginEntry?.instance?.getDefaultOptions instanceof Function) {
      const pluginsDefaultOptions = savedPluginEntry.instance.getDefaultOptions();
      debug('Retrieving plugin\'s default options => %O', pluginsDefaultOptions);
      debug('Updating plugin\'s current options %O', savedPluginEntry.pluginOptions);
      _.defaults(savedPluginEntry.pluginOptions, pluginsDefaultOptions);
      debug('with default values => %O', savedPluginEntry.pluginOptions);
    }
    
    // Check if filePath directory has node_modules
    const debugPathResolution = debug.extend('PathResolution');
    debugPathResolution('Plugin\'s file: %o', savedPluginEntry.filePath);
    let currentDirectory = upath.dirname(savedPluginEntry.filePath);
    debugPathResolution('Plugin\'s directory: %o', currentDirectory);
    let currentDirectoryPlusNodeModulesPart = upath.resolve(currentDirectory, 'node_modules');
    let loopSafetyCheck = 0;
    let hasNodeModulesDir = false;
    let isDirAlreadyOnNodeJSList = false;
    // normalize paths
    nodeJsListOfRequireDirectories = nodeJsListOfRequireDirectories.map((requireDirectory) => {
      return upath.normalize(requireDirectory);
    });
    debugPathResolution('Node.js list of require paths: %O', nodeJsListOfRequireDirectories);
    do {
      debugPathResolution('Looking for "node_modules" in directory: %o', currentDirectory);
      
      if(!upath.isAbsolute(currentDirectory)) {
        debugPathResolution('We expect directory to be an absolute path at this time. If it isn\'t, something is wrong and it\'s better to not attempt anything');
        break;
      }
      
      hasNodeModulesDir = fse.existsSync(currentDirectoryPlusNodeModulesPart);
        
      if(hasNodeModulesDir) {
        // Check if the directory is already on list of node.js paths. We don't need
        // to continue to add these since node.js already have them and checks them.
        isDirAlreadyOnNodeJSList = nodeJsListOfRequireDirectories.includes(currentDirectoryPlusNodeModulesPart);
        if(isDirAlreadyOnNodeJSList) {
          debugPathResolution('This directory is already checked by node.js so we are finished here.');
          break;
        } 
        
        // Check if the directory is already on our list.
        if(this._additionalNodeModulesDirectoriesForRequire.includes(currentDirectoryPlusNodeModulesPart)) {
          debugPathResolution('This directory is already on our list so we are finished here.');
          break;
        }
        
        debugPathResolution('Directory %o added to list of directories to look for plugins.', currentDirectoryPlusNodeModulesPart);
        this._additionalNodeModulesDirectoriesForRequire.push(currentDirectoryPlusNodeModulesPart);
      }
      
      // Check if we are at root dir. We don't need to continue then.
      const parsed = upath.parse(currentDirectory);
      if(parsed.root === parsed.dir && parsed.name === '') {
        debugPathResolution('We\'ve reached root dir, which is weird, but we are finished here.');
        break;
      }
      
      currentDirectory = upath.resolve(currentDirectory, '..');
      currentDirectoryPlusNodeModulesPart = upath.resolve(currentDirectory, 'node_modules');

      loopSafetyCheck += 1;
      if(loopSafetyCheck > 31000) {
        console.warn('PluginManager#registerPlugin - path resolution loop reached 31000 iterations. If you have this many subdirectories, wow. '
        + 'If you don\'t have so many subdirectories, we did something wrong and this prevents application to be stuck inside loop. '
        + 'Please contact us to check this issue.');
        break;
      }

    } while(true); // eslint-disable-line no-constant-condition
    
    debugPathResolution('List of directories to look for now is: %O', this._additionalNodeModulesDirectoriesForRequire);

    // If plugin have onInitialize function, call it with options as argument.
    if(pluginInstance.onInitialize && pluginInstance.onInitialize instanceof Function) {
      const ev = new PluginEvent({}, this);
      ev.debug = debugModule(`ESDoc:Plugin:${savedPluginEntry.name}#onInitialize`);
      pluginInstance.onInitialize(ev, savedPluginEntry.pluginOptions, this._globalOptions);
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
    debug('#_execHandler: About to execute %o event on plugins having handler for it.', handlerName);
    
    if(typeof handlerName !== 'string') {
      console.error('[PluginManager::_execHandler] Error: handlerName parameter must be typeof string!', `${typeof handlerName} received.`);
    }
    
    for( const pluginName of this._pluginEntries.keys() ) {
      const pluginEntry = this._pluginEntries.get(pluginName);
      if(!pluginEntry.instance) {
        throw new Error(`Plugin "${pluginEntry.name}" is not instantiated! Cannot call "${handlerName}" on it. This means registration of plugin somehow failed.`);
      }
      // We don't have control over handlerName
      const targetFunction = pluginEntry.instance[handlerName];
      if( targetFunction && targetFunction instanceof Function ) {
        debug('Calling %O#%O', pluginName, handlerName);
        ev.data.option = pluginEntry.pluginOptions;
        ev.data.globalOption = this._globalOptions;
        ev.debug = debugModule(`ESDoc:Plugin:${pluginName}#${handlerName}`);
        
        //debug('Calling %s#%s', pluginName, handlerName);
        //ev.debug = debug;
        targetFunction.call(pluginEntry.instance, ev);
        debug('%O#%O finished.', pluginName, handlerName);
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
