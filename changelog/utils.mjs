import { inspect } from 'node:util';
import ansiColors from 'ansi-colors';

function log(coloredLevel, section, message, ...args) {
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

export function logDebug(section, message, ...args) {
  log(ansiColors.cyan('DEBUG'), section, message, ...args);
}

export function logInfo(section, message, ...args) {
  log(ansiColors.yellow('INFO '), section, message, ...args);
}

export function logError(section, message, ...args) {
  log(ansiColors.red('ERROR'), section, message, ...args);
}
