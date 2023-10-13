import log from './eslog.mjs';

log.showOnlyFromLevel(log.silly);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: log.silly('Test silly message');");
log.silly('Test silly message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.cyan('SILLY')} Test silly message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: log.debug('Test debug message');");
log.debug('Test debug message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.cyan('DEBUG')} Test debug message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: log.log('Test log message');");
log.log('Test log message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.yellow('  LOG')} Test log message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: log.info('Test info message');");
log.info('Test info message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.yellow(' INFO')} Test info message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: log.warn('Test warn message');");
log.warn('Test warn message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.red(' WARN')} Test warn message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: log.warning('Test warning message');");
log.warning('Test warning message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.red(' WARN')} Test warning message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: log.error('Test error message');");
log.error('Test error message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.bgRed.white('ERROR')} Test error message`);



console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: const sectionTestLog = log.withSection('SectionTest');");
const sectionTestLog = log.withSection('SectionTest');

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: sectionTestLog.silly('Test silly message');");
sectionTestLog.silly('Test silly message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.cyan('SILLY')} ${ansiColors.magenta('SectionTest')} Test silly message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: sectionTestLog.debug('Test debug message');");
sectionTestLog.debug('Test debug message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.cyan('DEBUG')} ${ansiColors.magenta('SectionTest')} Test debug message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: sectionTestLog.log('Test log message');");
sectionTestLog.log('Test log message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.yellow('  LOG')} ${ansiColors.magenta('SectionTest')} Test log message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: sectionTestLog.info('Test info message');");
sectionTestLog.info('Test info message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.yellow(' INFO')} ${ansiColors.magenta('SectionTest')} Test info message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: sectionTestLog.warn('Test warn message');");
sectionTestLog.warn('Test warn message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.red(' WARN')} ${ansiColors.magenta('SectionTest')} Test warn message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: sectionTestLog.warning('Test warning message');");
sectionTestLog.warning('Test warning message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.red(' WARN')} ${ansiColors.magenta('SectionTest')} Test warning message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: sectionTestLog.error('Test error message');");
sectionTestLog.error('Test error message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.bgRed.white('ERROR')} ${ansiColors.magenta('SectionTest')} Test error message`);



console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: const sectionAndMemberTestLog = log.withSection('SectionAndMemberTest');");
const sectionAndMemberTestLog = log.withSection('SectionAndMemberTest', {firstArgumentAsSectionMember: true});

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: sectionAndMemberTestLog.silly('Test silly message');");
sectionAndMemberTestLog.silly('member', 'Test silly message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.cyan('SILLY')} ${ansiColors.magenta('SectionAndMemberTest#member')} Test silly message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: sectionAndMemberTestLog.debug('Test debug message');");
sectionAndMemberTestLog.debug('member', 'Test debug message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.cyan('DEBUG')} ${ansiColors.magenta('SectionAndMemberTest#member')} Test debug message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: sectionAndMemberTestLog.log('Test log message');");
sectionAndMemberTestLog.log('member', 'Test log message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.yellow('  LOG')} ${ansiColors.magenta('SectionAndMemberTest#member')} Test log message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: sectionAndMemberTestLog.info('Test info message');");
sectionAndMemberTestLog.info('member', 'Test info message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.yellow(' INFO')} ${ansiColors.magenta('SectionAndMemberTest#member')} Test info message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: sectionAndMemberTestLog.warn('Test warn message');");
sectionAndMemberTestLog.warn('member', 'Test warn message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.red(' WARN')} ${ansiColors.magenta('SectionAndMemberTest#member')} Test warn message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: sectionAndMemberTestLog.warning('Test warning message');");
sectionAndMemberTestLog.warning('member', 'Test warning message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.red(' WARN')} ${ansiColors.magenta('SectionAndMemberTest#member')} Test warning message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: sectionAndMemberTestLog.error('Test error message');");
sectionAndMemberTestLog.error('member', 'Test error message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.bgRed.white('ERROR')} ${ansiColors.magenta('SectionAndMemberTest#member')} Test error message`);



console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: const extendedSectionTestLog = sectionTestLog.withSection('SecondSection');");
const extendedSectionTestLog = sectionTestLog.withSection('SecondSection');

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: extendedSectionTestLog.silly('Test silly message');");
extendedSectionTestLog.silly('Test silly message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.cyan('SILLY')} ${ansiColors.magenta('SectionTest-SecondSection')} Test silly message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: extendedSectionTestLog.debug('Test debug message');");
extendedSectionTestLog.debug('Test debug message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.cyan('DEBUG')} ${ansiColors.magenta('SectionTest-SecondSection')} Test debug message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: extendedSectionTestLog.log('Test log message');");
extendedSectionTestLog.log('Test log message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.yellow('  LOG')} ${ansiColors.magenta('SectionTest-SecondSection')} Test log message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: extendedSectionTestLog.info('Test info message');");
extendedSectionTestLog.info('Test info message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.yellow(' INFO')} ${ansiColors.magenta('SectionTest-SecondSection')} Test info message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: extendedSectionTestLog.warn('Test warn message');");
extendedSectionTestLog.warn('Test warn message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.red(' WARN')} ${ansiColors.magenta('SectionTest-SecondSection')} Test warn message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: extendedSectionTestLog.warning('Test warning message');");
extendedSectionTestLog.warning('Test warning message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.red(' WARN')} ${ansiColors.magenta('SectionTest-SecondSection')} Test warning message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: extendedSectionTestLog.error('Test error message');");
extendedSectionTestLog.error('Test error message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.bgRed.white('ERROR')} ${ansiColors.magenta('SectionTest-SecondSection')} Test error message`);




console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: const extendedSectionAndMemberTestLog = sectionAndMemberTestLog.withSection('SecondSection');");
const extendedSectionAndMemberTestLog = sectionAndMemberTestLog.withSection('SecondSection', {firstArgumentAsSectionMember: true});

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: extendedSectionAndMemberTestLog.silly('Test silly message');");
extendedSectionAndMemberTestLog.silly('member', 'Test silly message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.cyan('SILLY')} ${ansiColors.magenta('SectionAndMemberTest-SecondSection#member')} Test silly message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: extendedSectionAndMemberTestLog.debug('Test debug message');");
extendedSectionAndMemberTestLog.debug('member', 'Test debug message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.cyan('DEBUG')} ${ansiColors.magenta('SectionAndMemberTest-SecondSection#member')} Test debug message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: extendedSectionAndMemberTestLog.log('Test log message');");
extendedSectionAndMemberTestLog.log('member', 'Test log message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.yellow('  LOG')} ${ansiColors.magenta('SectionAndMemberTest-SecondSection#member')} Test log message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: extendedSectionAndMemberTestLog.info('Test info message');");
extendedSectionAndMemberTestLog.info('member', 'Test info message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.yellow(' INFO')} ${ansiColors.magenta('SectionAndMemberTest-SecondSection#member')} Test info message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: extendedSectionAndMemberTestLog.warn('Test warning message');");
extendedSectionAndMemberTestLog.warn('member', 'Test warn message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.red(' WARN')} ${ansiColors.magenta('SectionAndMemberTest-SecondSection#member')} Test warn message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: extendedSectionAndMemberTestLog.warning('Test warning message');");
extendedSectionAndMemberTestLog.warning('member', 'Test warning message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.red(' WARN')} ${ansiColors.magenta('SectionAndMemberTest-SecondSection#member')} Test warning message`);

console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
console.log("running: extendedSectionAndMemberTestLog.error('Test error message');");
extendedSectionAndMemberTestLog.error('member', 'Test error message');
console.log('^^^ EXPECTED TO BE vvv');
console.log(`${ansiColors.bgRed.white('ERROR')} ${ansiColors.magenta('SectionAndMemberTest-SecondSection#member')} Test error message`);
