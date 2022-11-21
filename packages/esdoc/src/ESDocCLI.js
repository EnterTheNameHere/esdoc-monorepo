#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import minimist from 'minimist';
import ESDoc from './ESDoc.js';
import NPMUtil from '@enterthenamehere/esdoc-core/lib/Util/NPMUtil.js';
import { FileManager } from '@enterthenamehere/esdoc-core/lib/Util/FileManager';

/**
 * Command Line Interface for ESDoc.
 *
 * @example
 * let cli = new ESDocCLI(process.argv);
 * cli.exec();
 */
export default class ESDocCLI {
  /**
   * Create instance.
   * @param {Object} argv - this is node.js argv(``process.argv``)
   */
  constructor(argv) {
    /** @type {ESDocCLIArgv} */
    this._argv = minimist(argv.slice(2));

    console.log('this._argv:');
    console.log(this._argv);
    
    if (this._argv.h || this._argv.help) {
      this._showHelp();
      process.exit(0);
    }

    if (this._argv.v || this._argv.version) {
      this._showVersion();
      process.exit(0);
    }

    if (this._argv.init) {
      this._createConfigFileForUser();
      process.exit(0);
    }
  }

  /**
   * execute to generate document.
   */
  exec() {
    let config = null;

    const configPath = this._findConfigFilePath();
    if (configPath) {
      config = this._createConfigFromJSONFile(configPath);
    } else {
      config = this._createConfigFromPackageJSON();
    }

    if (config) {
      console.log('config:');
      console.log(config);
      ESDoc.generate(config);
    } else {
      this._showHelp();
      process.exit(1);
    }
  }

  /**
   * show help of ESDoc
   * @private
   */
  _showHelp() { /* eslint-disable no-console */
    console.log(
        `${String('Usage: esdoc [-c or --config esdoc.json]\n' +
        '\n' +
        'Options:\n' +
        '    -c,  --config    specify config file                     [string]\n' +
        '    -h,  --help      output usage information (this text)\n' +
        '    -v,  --version   output the version number\n' +
        '         --init      create .esdoc.json with default values\n' +
        'ESDoc finds configuration by the order:\n' +
        '    1. `-c your-esdoc.json`\n' +
        '    2. `[.]esdoc.json` in current directory\n' +
        '    3. `[.]esdoc.js` in current directory\n' +
        '    4. `esdoc` property in package.json')}`
    );
  } /* eslint-enable no-console */

  /**
   * show version of ESDoc
   * @private
   */
  _showVersion() {
    const packageObj = NPMUtil.findPackage();
    if (packageObj) {
      console.log(packageObj.version); // eslint-disable-line no-console
    } else {
      console.log('0.0.0'); // eslint-disable-line no-console
    }
  }

  /**
   * Creates ".esdoc.json" file for user, with default required values.
   */
  _createConfigFileForUser() {
    if( fs.existsSync('.esdoc.json') ) {
      console.warn('.esdoc.json file already exists!');
      return;
    }
    const text =
      '{\n' +
      '  "source": "./src",\n' +
      '  "destination": "./docs",\n' +
      '  "debug": false,\n' +
      '  "verbose": false,\n' +
      '  "includes": [\n' +
      '    "*.js"\n' +
      '  ],\n' +
      '  "excludes": [\n' +
      '    "*.config.js",\n' +
      '    "*modules/"\n' +
      '  ],\n' +
      '  "index": "./README.md",\n' +
      '  "package": "./package.json",\n' +
      '  "plugins": [{\n' +
      '    "name": "esdoc-standard-plugin",\n' +
      '    "options": {\n' +
      '      "accessor": { "access": ["public", "protected", "private"], "autoPrivate": true },\n' +
      '      "lint": { "enable": true },\n' +
      '      "coverage": { "enable": true },\n' +
      '      "undocumentIdentifier": { "enable": true },\n' +
      '      "unexportedIdentifier": { "enable": false },\n' +
      '      "typeInference": { "enable": true },\n' +
      '      "test": {\n' +
      '        "source": "./test",\n' +
      '        "includes": ["*.(spec|Spec|test|Test).js"],\n' +
      '        "excludes": ["*.config.js"]\n' +
      '      }\n' +
      '    }\n' +
      '  }]\n' +
      '}';
    try {
      fs.writeFileSync('.esdoc.json',text);
    } catch (err) {
      console.error('Error: creating .esdoc.json failed!\n', err.message);
      console.error(err);
    }
  }

  /**
   * Returns string filepath of ESDoc config file if exists or null if none can be found.
   * @returns {string|null} Config file path.
   * @private
   */
  _findConfigFilePath() {
    if( this._argv.c ) {
      // We DO NOT control this._argv.c
      if( fs.existsSync(this._argv.c) ) {
        return this._argv.c;
      }
    }

    if( this._argv.config ) {
      // We DO NOT control this._argv.config
      if( fs.existsSync(this._argv.config) ) {
        return this._argv.config;
      }
    }

    let filePath = path.resolve('./.esdoc.json');
    // We control filePath
    if( fs.existsSync( filePath ) ) {
      return filePath;
    }

    filePath = path.resolve('./esdoc.json');
    // We control filePath
    if( fs.existsSync( filePath ) ) {
      return filePath;
    }
    
    filePath = path.resolve('./.esdoc.js');
    // We control filePath
    if( fs.existsSync( filePath ) ) {
      return filePath;
    }
    
    filePath = path.resolve('./esdoc.js');
    // We control filePath
    if( fs.existsSync( filePath ) ) {
      return filePath;
    }

    return null;
  }

  /**
   * create config object from config file.
   * @param {string} configFilePath - config file path.
   * @return {ESDocConfig} config object.
   * @private
   */
  _createConfigFromJSONFile(configFilePath) {
    configFilePath = path.resolve(configFilePath);
    const ext = path.extname(configFilePath);
    if (ext === '.js') {
      /* eslint-disable global-require */
      return require(configFilePath);
    }
    
    const configJSON = FileManager.readFileContents(configFilePath);
    const config = JSON.parse(configJSON);
    return config;
  }

  /**
   * create config object from package.json.
   * @return {ESDocConfig|null} config object.
   * @private
   */
  _createConfigFromPackageJSON() {
    try {
      const filePath = path.resolve('./package.json');
      const packageJSON = FileManager.readFileContents(filePath);
      const packageObj = JSON.parse(packageJSON);
      return packageObj.esdoc;
    } catch (e) {
      // ignore
    }

    return null;
  }
}

// if this file is directory executed, work as CLI.
const executedFilePath = fs.realpathSync(process.argv[1]);
if (executedFilePath === __filename) {
  const cli = new ESDocCLI(process.argv);
  cli.exec();
}
