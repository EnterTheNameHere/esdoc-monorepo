import ansiColors from 'ansi-colors';

function getLogLevelFunctionProxyHandler() {
  return {
    /**
     * @param {Function} target
     * @param {Logger} thisArgument
     * @param {Array<any>} argumentsList
     */
    apply(target, thisArgument, argumentsList) {
      //console.log(ansiColors.bgYellow.black('logLevelFunctionProxyHandler::apply'), ansiColors.bgBlue(logger.id), {/*target, thisArgument, argumentsList*/});
      //console.log('thisArgument %O', thisArgument);
      //console.log('argumentsList %O', argumentsList);
      
      // Assignment is intentional
      // eslint-disable-next-line no-param-reassign
      argumentsList.unshift(thisArgument.options);
      
      return Reflect.apply(target, thisArgument, argumentsList);
    },
  };
}

function getLogOptionsProxyHandler(logger, options) {
  //console.log(ansiColors.bgYellow.black('LogOptionsProxyHandler'), 'Creating new Proxy handler for', ansiColors.bgBlue(logger.id), 'with options', options);
  
  return {
    logger: logger,
    options: options,
  
    apply(target, thisArgument, argumentsList) {
      console.log(ansiColors.bgYellow.black('LogOptionsProxyHandler::apply'), ansiColors.bgBlue(this.logger.id), {target, thisArgument, argumentsList});
      return Reflect.apply(target, thisArgument, argumentsList);
    },
    
    construct(target, args) {
      console.log(ansiColors.bgYellow.black('LogOptionsProxyHandler::construct'), ansiColors.bgBlue(this.logger.id), {target, args});
      return Reflect.construct(target, args);
    },
    
    defineProperty(target, key, descriptor) {
      //console.log(ansiColors.bgYellow.black('LogOptionsProxyHandler::defineProperty'), ansiColors.bgBlue(this.logger.id), ansiColors.bgGreen(key), descriptor);
      //console.log('target before:', target);
      const temp = Reflect.defineProperty(target, key, descriptor);
      //console.log('target after:', target);
      return temp;
    },
    
    deleteProperty(target, property) {
      console.log(ansiColors.bgYellow.black('LogOptionsProxyHandler::deleteProperty'), ansiColors.bgBlue(this.logger.id), ansiColors.bgGreen(property));
      return Reflect.deleteProperty(target, property);
    },
    
    get(target, prop, receiver) {
      //console.log(ansiColors.bgYellow.black('LogOptionsProxyHandler::get'), ansiColors.bgBlue(this.logger.id), ansiColors.bgGreen(prop));
      
      /**
       * @note
       * Logger#options#id is an alias for Logger#id
       */
      if(prop === 'id') {
        return this.logger.id;
      }
      
      //console.log('Checking if logger %O has property %O', this.logger.id, prop);
      if(Object.hasOwn(this.options, prop)) {
        //console.log('Logger %O has property %O', this.logger.id, prop);
        const temp = this.options[prop];
        //console.log('Its value is:', temp);
        return temp;
      }
      
      //console.log('Logger %O does not have property %O', this.logger.id, prop);
      const temp = this.logger.parent.options[prop];
      //console.log('Returning value of parent logger %O, value is:', this.logger.parent.id, temp);
      return temp;
    },
    
    getOwnPropertyDescriptor(target, propertyKey) {
      //console.log(ansiColors.bgYellow.black('LogOptionsProxyHandler::getOwnPropertyDescriptor'), ansiColors.bgBlue(this.logger.id), ansiColors.bgGreen(propertyKey));
      // TODO: think of better way to make id readonly...
      if(propertyKey === 'id') {
        return {
          value: this.logger.id,
          writable: false,
          enumerable: false,
          configurable: false,
        };
      }
      const temp = Reflect.getOwnPropertyDescriptor(target, propertyKey);
      //console.log(temp);
      return temp;
    },

    getPrototypeOf(target) {
      console.log(ansiColors.bgYellow.black('LogOptionsProxyHandler::getPrototypeOf'), ansiColors.bgBlue(this.logger.id));
      return Reflect.getPrototypeOf(target);
    },

    has(target, prop) {
      console.log(ansiColors.bgYellow.black('LogOptionsProxyHandler::has'), ansiColors.bgBlue(this.logger.id), ansiColors.bgGreen(prop));
      return Reflect.has(target, prop);
    },
    
    isExtensible(target) {
      console.log(ansiColors.bgYellow.black('LogOptionsProxyHandler::isExtensible'), ansiColors.bgBlue(this.logger.id));
      return Reflect.isExtensible(target);
    },

    // ownKeys(target) {
    //   console.log(ansiColors.bgYellow.black('LogOptionsProxyHandler::ownKeys'), ansiColors.bgBlue(this.logger.id));
    //   return Reflect.ownKeys(target);
    // },
    
    preventExtensions(target) {
      console.log(ansiColors.bgYellow.black('LogOptionsProxyHandler::preventExtensions'), ansiColors.bgBlue(this.logger.id));
      return Reflect.preventExtensions(target);
    },

    set(target, propertyKey, value, receiver) {
      //console.log(ansiColors.bgYellow.black('LogOptionsProxyHandler::set'), ansiColors.bgBlue(this.logger.id), ansiColors.bgGreen(propertyKey), value);
      // TODO: check propertyKey is safe
      this.options[propertyKey] = value;
      //console.log('options after:', this.options);
      return true;
    },
    
    setPrototypeOf(target, prototype) {
      console.log(ansiColors.bgYellow.black('LogOptionsProxyHandler::setPrototypeOf'), ansiColors.bgBlue(this.logger.id), {target, prototype});
      return Reflect.setPrototypeOf(target, prototype);
    }
  };
}

let sectionIdNumber = 1;
/**
 * If Logger has either no section name set or name is empty, a number will be used instead,
 * so '1' or '2' can be used as name.
 * @returns {number}
 */
function getSectionIdNumber() {
  return sectionIdNumber++;
}

const defaultLogLevelOptions = [
  { level: 0, name: 'silly',             nameColor: ansiColors.cyan,        outputFunction: console.debug },
  { level: 1, name: 'debug',             nameColor: ansiColors.cyan,        outputFunction: console.debug },
  // eslint-disable-next-line no-console
  { level: 2, name: 'log',               nameColor: ansiColors.yellow,      outputFunction: console.log },
  // eslint-disable-next-line no-console
  { level: 3, name: 'info',              nameColor: ansiColors.yellow,      outputFunction: console.log },
  { level: 4, name: ['warn', 'warning'], nameColor: ansiColors.red,         outputFunction: console.warn,    showName: 'warn' },
  { level: 5, name: 'error',             nameColor: ansiColors.bgRed.white, outputFunction: console.error },
];

const defaultOptions = {
  debug: false,
  enabled: true,
  logLevelOptions: defaultLogLevelOptions,
  copyParentLogLevelsToSection: true,
  sectionName: null,
  sectionColor: ansiColors.magenta,
  sectionSeparator: '-',
  firstArgumentAsSectionMember: false,
  sectionAndFirstArgumentConcatString: '#',
  showLogsFromLevel: 3,
};

/**
 * Logger is an _exotic_ object providing logging capabilities with as much quality of life features as possible.
 * Of course, these quality of life features are great for me, they might not be great for you.
 * 
 * You can get default logger by importing eslog.mjs:
 * ```js
 * import { log } from 'eslog.mjs';
 * log.debug('Debug message');
 * ```
 * 
 * Each log message begins with log level name:
 * ```js
 * import { log } from 'eslog.mjs';
 * log.silly('This is silly message'); // SILLY This is silly message
 * log.warn('This is warn message'); // WARN This is warn message
 * ```
 * Logger by default provides 'silly', 'debug', 'log', 'info', 'warn', 'warning' and 'error' logging level functions.
 * 
 * You can create children loggers with custom section name:
 * ```js
 * import { log } from 'eslog.mjs';
 * const childLog = log.withSection('Section');
 * childLog.debug('Debug message'); // DEBUG Section Debug message
 * ```
 * 
 * You can make logger for each file for example:
 * ```js
 * import { defaultLog } from 'eslog.mjs';
 * const log = defaultLog.withSection('FileName.ext');
 * log.debug('Message from FileName.ext'); // DEBUG FileName.ext Message from FileName.ext
 * ```
 * 
 * You can make first argument part of SectionName by setting options.firstArgumentAsSectionMember to **true**.
 * ```js
 * import { log } from 'eslog.mjs';
 * log.options.firstArgumentAsSectionMember = true;
 * // or
 * const sectionLog = log.withSection('Section', { firstArgumentAsSectionMember: true });
 * 
 * log.silly('partOfSectionName', 'This is message'); // SILLY partOfSectionName This is message
 * // default Logger doesn't have sectionName, so only the first argument is displayed as section name
 * sectionLog.silly('partOfSectionName', 'This is message'); // SILLY Section#partOfSectionName This is message
 * ```
 * 
 * Which can be used for example as method name:
 * ```js
 * import { defaultLog } from 'eslog.mjs';
 * const log = defaultLog.withSection('ExampleClass');
 * class ExampleClass {
 *     constructor() {
 *         log.debug('constructor', 'Inside constructor now...'); // DEBUG ExampleClass#constructor Inside constructor now...
 *     }
 * }
 * ```
 * 
 * Or you can create local log for whole member function, if you will do heavier logging:
 * ```js
 * import { defaultLog } from 'eslog.mjs;
 * const log = defaultLog.withSection('ExampleClass');
 * class ExampleClass {
 *     loggingHeavyMethod() {
 *         const lLog = log.withSection('loggingHeavyMethod', {
 *             firstArgumentAsSectionMember: false, // explicitly turn off
 *             sectionSeparator: '#' // sectionSeparator is '-' by default, different from sectionAndFirstArgumentConcatString which is '#'
 *         });
 * 
 *         lLog.debug('Message from inside loggingHeavyMethod...'); // DEBUG ExampleClass#loggingHeavyMethod Message from inside loggingHeavyMethod...
 *         // (...)
 *         lLog.debug('More logging...'); // DEBUG ExampleClass#loggingHeavyMethod More logging...
 *     }
 * }
 * ```
 * 
 * Each Logger has it's own options "container". Default logger loads default values into its options object and
 * all children will lookup parent's options if options value was not explicitly overridden:
 * ```js
 * import { log } from 'eslog.mjs';
 * log.options.firstArgumentAsSectionMember = true;
 * // Makes first argument provided to logging function to be part of section name
 * log.silly('exampleMember', 'This is silly message'); // SILLY exampleMember This is silly message
 * const sectionLog = log.withSection('Section1'); // No options overridden
 * sectionLog.silly('exampleMember', 'This is silly message'); // SILLY Section1#exampleMember This is silly message
 * const sectionWithoutMember = log.withSection('Section2', { firstArgumentAsSectionMember: false }); // override options
 * sectionWithoutMember.silly('This is silly message'); // SILLY Section2 This is silly message
 * sectionLog.silly('This is not silly message'); // SILLY Section1#This is not silly message
 * ```
 */
class Logger {
  id = 'id not set yet';
  parent = null;
  options = null;
  
  _loggingFunctionNames = [];
  
  constructor(options, parent = null) {
    //console.log('==================================================================================');
    //console.log('Creating new Logger', {options, parent});
    
    if(typeof options === 'undefined') {
      // expected
    } else if(typeof options !== 'object') {
      console.error('eslog.mjs - options object given as argument to Logger constructor is invalid! Logging won\'t work.');
      Logger.failed = true;
      this.enabled = false;
      return;
    }
    
    this.parent = parent;
    
    if(this.parent === null) {
      //console.log(ansiColors.bgCyan('parent is null, creating options with default values and provided options.'));
      // Make this.options readonly
      Object.defineProperty(this, 'options', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: new Proxy({}, getLogOptionsProxyHandler(this, {...defaultOptions, ...options ??  {}}))
      });
    } else {
      //console.log(ansiColors.bgCyan('parent is available, creating options with only provided values.'));
      // Make this.options readonly
      Object.defineProperty(this, 'options', {
        configurable: false,
        enumerable: true,
        writable: false,
        value: new Proxy({}, getLogOptionsProxyHandler(this, options))
      });
    }
    
    // Set id (display name) of this Logger. This will be printed as SectionName.
    if(this.parent === null) {
      //console.log(ansiColors.bgCyan('parent is null, setting name which is either default or name provided as sectionName.'));
      this.id = this.options.sectionName ?? 'default';
    } else {
      //console.log(ansiColors.bgCyan('parent is available, determining our name now.'));
      if(this.parent.parent === null) {
        //console.log(ansiColors.bgCyan('    parent is top Logger, checking if sectionName is provided.'));
        const sectionName = this.options.sectionName;
        if(sectionName === null
          || typeof sectionName === 'undefined'
          || sectionName.trim().length === 0) {
          //console.log(ansiColors.bgCyan('    sectionName is either not provided or is empty, using generic name.'));
          // Section name is either not provided or is empty, so use generic name
          // eslint-disable-next-line prefer-template
          this.id = this.parent.id + this.options.sectionSeparator + 'section' + getSectionIdNumber();
        } else {
          //console.log(ansiColors.bgCyan('    sectionName is provided, using it as a Logger name.'));
          // Printing 'default-sectionName' would only take space on screen, so print just 'sectionName'.
          this.id = sectionName;
        }
      } else {
        //console.log(ansiColors.bgCyan('    parent is not top, we will be using its sectionName and adding our sectionName.'));
        const sectionName = this.options.sectionName;
        if(sectionName === null
          || typeof sectionName === 'undefined'
          || sectionName.trim().length === 0) {
          //console.log(ansiColors.bgCyan('    our sectionName is either not provided or empty, using generic name.'));
          // Section name is empty, use generic name
          // eslint-disable-next-line prefer-template
          this.id = this.parent.id + this.options.sectionSeparator + 'section' + getSectionIdNumber();
        } else {
          //console.log(ansiColors.bgCyan('    adding our sectionName to parent\'s name.'));
          this.id = this.parent.id + this.options.sectionSeparator + sectionName;
        }
      }
    }
    
    /**
     * Set custom log level functions.
     * 
     * @note
     * If parent is null the option to copy log level functions is not applicable and functions must be
     * created, because there would be no other log level functions this logger can use. In such case
     * this Logger's options.logLevelOptions will be used.
     */
    if(this.parent === null) {
      //console.log(ansiColors.bgCyan('parent is null, creating custom log level functions using options.'));
      for(const aLoggingFunctionOptions of this.options.logLevelOptions) {
        this.addCustomLoggingFunction(aLoggingFunctionOptions);
      }
    } else {
      //console.log(ansiColors.bgCyan('parent is available, checking if user want to copy log level functions from parent.'));
      if(this.options.copyParentLogLevelsToSection) {
        //console.log(ansiColors.bgCyan('user wants to copy log level functions.'));
        const parentLogLevelFunctionNames = this.parent.getLogLevelFunctionNames();
        //console.log('Logger[%O] parent has these log level functions: %O', this.id, parentLogLevelFunctionNames);
        for(const logLevelFunctionName of parentLogLevelFunctionNames) {
          //console.log('Logger[%O] setting parent\'s log level function named %O to this', this.id, logLevelFunctionName);
          //this[logLevelFunctionName] = new Proxy( this.parent[logLevelFunctionName], getLogLevelFunctionProxyHandler(this) );
          this[logLevelFunctionName] = this.parent[logLevelFunctionName];
          this._loggingFunctionNames.push(logLevelFunctionName);
        }
      } else {
        //console.log(ansiColors.bgCyan('parent is available, but user wants to create new log level functions using options.'));
        // TODO: deal with case where use of options from parent is requested
        for(const aLoggingFunctionOptions of this.options.logLevelOptions) {
          this.addCustomLoggingFunction(aLoggingFunctionOptions);
        }
      }
    }
    
    //console.log('Logger[%O] initialized', this.id);
  }
  
  withSection(sectionName, options) {
    //console.log('Logger[%O] is creating Logger with SectionName %O...', this.id, sectionName);
    
    const loggerWithSection = new Logger({...options ?? {}, sectionName: sectionName}, this);
    return loggerWithSection;
  }
  
  /**
   * Returns all names of custom log level functions available on this Logger,
   * like ['silly', 'debug', 'log', 'info', 'warn', 'warning', 'error']
   * @returns {Array<string>}
   */
  getLogLevelFunctionNames() {
    return this._loggingFunctionNames;
  }

  getLogLevelNumberForName(logLevelName) {
    for(const aLogLevelOptions of this.options.logLevelOptions) {
      // Name could be an array of aliases for same log level, like ['warn', 'warning']
      if(Array.isArray(aLogLevelOptions?.name) && aLogLevelOptions.includes(logLevelName)) {
        return aLogLevelOptions.level;
      } else if(typeof aLogLevelOptions?.name === 'string' && aLogLevelOptions.name === logLevelName) {
        return aLogLevelOptions.level;
      }
    }
    
    // Log level with this name was not found. Let's return value which would enable
    // all messages and still can indicate something is wrong.
    return -1;
  }
  
  // TODO: re-create log level functions to use no-op for levels we don't want to display
  showOnlyFromLevel(logLevelNumberOrName) {
    if(typeof logLevelNumberOrName === 'number') {
      this.options.showLogsFromLevel = logLevelNumberOrName;
    } else if(typeof logLevelNumberOrName === 'string') {
      this.options.showLogsFromLevel = this.getLogLevelNumberForName(logLevelNumberOrName);
    } else if(typeof logLevelNumberOrName === 'function') {
      // User might use log.showOnlyFromLevel(log.debug), so check if such method exists
      for(const functionName of this._loggingFunctionNames) {
        if(this[functionName] === logLevelNumberOrName) {
          this.options.showLogsFromLevel = this.getLogLevelNumberForName(functionName);
          break;
        }
      }
    } else {
      console.warn('eslog.mjs, Logger#showOnlyFromLevel: Unknown level requested. All logs shown instead.');
      this.options.showLogsFromLevel = -1;
    }
  }

  addCustomLoggingFunction(loggingFunctionOptions) {
    //console.log('Logger[%O]#addCustomLoggingFunction named %O', this.id, loggingFunctionOptions.name, loggingFunctionOptions);
    // TODO: check logger function name is valid property name
    
    // Name could be an array of aliases.
    // NOTE: We define new function for every alias. We do not reuse the same single function for all aliases.
    if(Array.isArray(loggingFunctionOptions.name)) {
      // TODO: possibility of nested string arrays like: name: [ name: [ name: [ name: "name" ] ] ]
      for(const name of loggingFunctionOptions.name) {
        this.addCustomLoggingFunction({...loggingFunctionOptions, name: name});
      }
    } else {
      if(Object.hasOwn(loggingFunctionOptions.name)) delete this[loggingFunctionOptions.name];

      Object.defineProperty(this, loggingFunctionOptions.name, {
        configurable: true,
        enumerable: true,
        writable: false,
        value: new Proxy(
            (options, ...args) => {
              //console.log('Custom log level function template');
              //console.log('options', options);
              //console.log('args', args);
              this.logFunction({loggingFunctionOptions: loggingFunctionOptions, args: args, options: options});
            },
            getLogLevelFunctionProxyHandler(this)
          )
      });
      
      // Cache function name for easier access later
      this._loggingFunctionNames.push(loggingFunctionOptions.name);
    }
  }
  
  logFunction(logMessageObject) {
    if(typeof logMessageObject === 'undefined' || logMessageObject === null) {
      console.error('esdoc.mjs, Logger[%O]#logFunction called with undefined or null logMessageObject', this.id, logMessageObject);
    }

    //console.log('Logger[%O,%O]#logFunction', this.id, logMessageObject.options.id);
    //console.log('logMessageObject: %O', logMessageObject);
    //console.log('this:', this);
    
    const options = logMessageObject.options;
    
    if(!options.enabled) return;
    if(options.showLogsFromLevel > logMessageObject.loggingFunctionOptions.level) return;
    
    // TODO: allow user to set whether level name should be printed
    /**
     * @type {string}
     */
    let levelName = logMessageObject.loggingFunctionOptions.showName ?? logMessageObject.loggingFunctionOptions.name ?? '';
    // TODO: allow user to set whether level name should be capitalized
    levelName = levelName.toUpperCase();
    // TODO: allow user to set horizontal alignment of level name
    levelName = levelName.padStart(5, ' ');
    // TODO: allow user to set whether it should be colorized
    levelName = logMessageObject.loggingFunctionOptions.nameColor(levelName);
    
    let sectionName = options.sectionName === null ? '' : options.id;
    if(options.firstArgumentAsSectionMember) {
      sectionName += (sectionName.length === 0 ? '' : options.sectionAndFirstArgumentConcatString) + logMessageObject.args.shift();
    }
    
    if(sectionName.length > 0) {
      sectionName = options.sectionColor(sectionName);
      logMessageObject.loggingFunctionOptions.outputFunction(levelName, sectionName, ...logMessageObject.args ?? '');
    } else {
      logMessageObject.loggingFunctionOptions.outputFunction(levelName, ...logMessageObject.args ?? '');
    }
  }
  
  enable(enable = true) {
    this.enabled = enable;
  }

  disable() {
    this.enabled = false;
  }
}

const log = new Logger();
export { log };
