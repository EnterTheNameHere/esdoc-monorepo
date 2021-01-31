import assert from 'assert';
import Logger from '../../src/ColorLogger.js';

describe('ColorLogger:', function () {
  function test(actual, level, expect) {
    level = level.toUpperCase();
    assert(actual.includes(`[${level}]`));

    const d = new Date();
    let month = d.getMonth() + 1;
    if (month < 10) month = `0${month}`;
    let date = d.getDate();
    if (date < 10) date = `0${date}`;
    let hour = d.getHours();
    if (hour < 10) hour = `0${hour}`;
    let minutes = d.getMinutes();
    if (minutes < 10) minutes = `0${minutes}`;
    let sec = d.getSeconds();
    if (sec < 10) sec = `0${sec}`;
    const now = `\\[${d.getFullYear()}-${month}-${date}T${hour}:${minutes}:${sec}.\\d+Z\\]`;
    assert(actual.match(new RegExp(now)));

    assert(actual.match(/\[ColorLogger.test.js:\d+:\d+\]/));

    assert(actual.includes(expect));
  }

  it('show log.', function () {
    let log;

    log = Logger.v('verbose log');
    test(log, 'v', 'verbose log');

    log = Logger.d('debug log');
    test(log, 'd', 'debug log');

    log = Logger.i('info log');
    test(log, 'i', 'info log');

    log = Logger.w('warning log');
    test(log, 'w', 'warning log');

    log = Logger.e('error log');
    test(log, 'e', 'error log');

    log = Logger.n('normal log');
    test(log, 'n', 'normal log');
  });

  it ('show log with object.', function () {
    let log = Logger.v({foo: 123, bar: [1, 2, 3]});
    assert(log.includes(`{
  "foo": 123,
  "bar": [
    1,
    2,
    3
  ]
}`));
  });

  it('does not show log.', function () {
    Logger.debug = false;
    const orig = console.log;
    console.log = ()=> {assert(false)};
    Logger.e('foo');
    console.log = orig;
    Logger.debug = true;
  });

  it('get all logs', function () {
    Logger.clearAllLogs();
    Logger.d('foo');
    Logger.d('bar');
    const logs = Logger.allLogs;
    assert(logs.length === 2);
    assert(logs[0].includes('foo'));
    assert(logs[1].includes('bar'));
  });
});
