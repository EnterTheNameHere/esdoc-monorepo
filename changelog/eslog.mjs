import { inspect } from 'node:util';
import ansiColors from 'ansi-colors';

const logProxyHandler = {
  apply(target, thisArgument, argumentsList) {
    console.log('handler::apply', {target, thisArgument, argumentsList});
    return Reflect.apply(target, thisArgument, argumentsList);
  },
  
  construct(target, args) {
    console.log('handler::construct', {target, args});
    return Reflect.construct(target, args);
  },

  defineProperty(target, key, descriptor) {
    console.log('handler::defineProperty', {target, key, descriptor});
    return Reflect.defineProperty(target, key, descriptor);
  },
  
  deleteProperty(target, property) {
    console.log('handler::deleteProperty', {target, property});
    return Reflect.deleteProperty(target, property);
  },

  get(target, prop, receiver) {
    console.log('handler::get', {/*target,*/ prop, /*receiver*/});
    return Reflect.get(target, prop, receiver);
  },
  
  getOwnPropertyDescriptor(target, prop) {
    console.log('handler::getOwnPropertyDescriptor', {target, prop});
    return Reflect.getOwnPropertyDescriptor(target, prop);
  },

  getPrototypeOf(target) {
    console.log('handler::getPrototypeOf', {target});
    return Reflect.getPrototypeOf(target);
  },

  has(target, prop) {
    console.log('handler::has', {target, prop});
    return Reflect.has(target, prop);
  },

  isExtensible(target) {
    console.log('handler::isExtensible', {target});
    return Reflect.isExtensible(target);
  },

  ownKeys(target) {
    console.log('handler::ownKeys', {target});
    return Reflect.ownKeys(target);
  },

  preventExtensions(target) {
    console.log('handler::preventExtensions', {target});
    return Reflect.preventExtensions(target);
  },

  set(target, property, value, receiver) {
    console.log('handler::set', {target, property, value, receiver});
    return Reflect.set(target, property, value, receiver);
  },
  
  setPrototypeOf(target, prototype) {
    console.log('handler::set', {target, prototype});
    return Reflect.setPrototypeOf(target, prototype);
  }
};

function newLoggerWithSection(sectionName) {
  return {
    sectionName: sectionName,
    
    apply(target, thisArgument, argumentsList) {
      //console.log('handler::apply', {/*target, thisArgument, argumentsList*/});
      return Reflect.apply(target, thisArgument, argumentsList);
    },
    
    get(target, prop, receiver) {
      //console.log('handler::get', {/*target,*/ prop/*, receiver*/});
      
      // We want to intercept logging functions
      if(['silly','debug','log','info','warn','warning','error'].includes(prop)) {
        const origFunction = Reflect.get(target, prop, receiver);
        
        return new Proxy(origFunction, {
          apply(target2, thisArgument, argumentsList) {
            //console.log('handler::apply', {/*target, thisArgument,*/ argumentsList});
            const newArgumentsList = [ansiColors.magenta(`${sectionName}#${argumentsList[0]}`), ...argumentsList.slice(1)];
            return Reflect.apply(target2, thisArgument, newArgumentsList);
          },
        });
      }
      
      return Reflect.get(target, prop, receiver);
    }
  };
}


class Logger {
  enabled = false;
  
  constructor() {
    this.silly   = this.log_function.bind(this,   ansiColors.cyan('SILLY'));
    this.debug   = this.log_function.bind(this,   ansiColors.cyan('DEBUG'));
    this.log     = this.log_function.bind(this, ansiColors.yellow('LOG  '));
    this.info    = this.log_function.bind(this, ansiColors.yellow('INFO '));
    this.warn    = this.log_function.bind(this,    ansiColors.red('WARN '));
    this.warning = this.warn;
    this.error   = this.log_function.bind(this,    ansiColors.red('ERROR'));
  }
  
  enable() {
    this.enabled = true;
  }
  
  disable() {
    this.enabled = false;
  }
  
  log_function(...args) {
    if(!this.enabled) return;

    console.log(...args);
  }
  
  old_log_function(coloredLevel, section, message, ...args) {
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

  withSection(sectionName) {
    return new Proxy(this, newLoggerWithSection(sectionName));
  }
}

const log = new Logger();
log.enable();
export { log };
