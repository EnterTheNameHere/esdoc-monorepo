import { inspect } from 'node:util';
import ansiColors from 'ansi-colors';

export function logDebug(section, message, ...args) {
  log.instance.log_function(ansiColors.cyan('DEBUG'), section, message, ...args);
}

export function logInfo(section, message, ...args) {
  log.instance.log_function(ansiColors.yellow('INFO '), section, message, ...args);
}

export function logWarning(section, message, ...args) {
  log.instance.log_function(ansiColors.red('WARN '), section, message, ...args);
}

export function logError(section, message, ...args) {
  log.instance.log_function(ansiColors.red('ERROR'), section, message, ...args);
}

class Logger {
  enabled = false;
  
  constructor() {
  
  }
  
  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  log_function(coloredLevel, section, message, ...args) {
    if(!this.enabled) return;

    const text = args.map( (value) => { return inspect(value, false, 10, true); } );
    
    let coloredSection = '';
    if(typeof section === 'string' && section.trim() !== '') {
      coloredSection = ansiColors.magenta(section);
    }
    
    const coloredLevelAndSection = `${coloredLevel} ${coloredSection}`;
    const clasAndMessage = `${coloredLevelAndSection} ${message}`;
    const clasamAndText = `${clasAndMessage} ${text}`;
    
    console.debug(clasamAndText);
  }
}

export class log {
  static debug   = logDebug;
  static info    = logInfo;
  static log     = logInfo;
  static warn    = logWarning;
  static warning = logWarning;
  static error   = logError;
  
  static #_instance = null;
  static get instance() {
    if(this.#_instance === null) {
      this.#_instance = new Logger();
    }
    return this.#_instance;
  }
  
  static enable() {
    this.instance.enable();
  }

  static disable() {
    this.instance.disable();
  }
  
  static setSection(sectionName) {
    console.log('log::setSection', sectionName);
    return this.instance;
  }
}

const instance = log.instance;
instance.enable();
