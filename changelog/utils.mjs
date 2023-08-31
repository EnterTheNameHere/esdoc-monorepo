import { exec } from 'node:child_process';
import { inspect } from 'node:util';
import ansiColors from 'ansi-colors';

export async function helperRunCommand(command) {
  return new Promise( (resolve, reject) => {
    const stdoutOutput = [], stderrOutput = [];
    const childProcess = exec(command);
    
    childProcess.stdout.on('data', (output) => {
      stdoutOutput.push( output.toString('utf-8') );
    });
    childProcess.stderr.on('data', (output) => {
      stderrOutput.push( output.toString('utf-8') );
    });
    
    childProcess.on('error', (error) => {
      // Error is returned as error property. The rest needs to be returned too.
      // eslint-disable-next-line prefer-promise-reject-errors
      reject( { error: error, code: error.code, std: { out: stdoutOutput, err: stderrOutput } } );
    });
    
    childProcess.on('close', (code) => {
      resolve( { error: null, code: code, std: { out: stdoutOutput, err: stderrOutput } } );
    });
  });
}



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

export function logWarning(section, message, ...args) {
  log(ansiColors.red('WARN '), section, message, ...args);
}

export function logError(section, message, ...args) {
  log(ansiColors.red('ERROR'), section, message, ...args);
}
