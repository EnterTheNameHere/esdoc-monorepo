const assert = require('assert');
const fs = require('fs');
const cheerio = require('cheerio');

describe('test inject style result:', function () {
  it('has injected style tag title', function () {
    const html = fs.readFileSync('./test/out/index.html').toString();
    const $ = cheerio.load(html);
    assert.equal($('link[href="./inject/css/0-inject.css"]').length, 1);
  });

  it('has injected style', function () {
    const style = fs.readFileSync('./test/out/inject/css/0-inject.css').toString();
    assert.equal(style.replace('\r\n', '\n'), 'body { background: #eee; }\n');
    const style2 = fs.readFileSync('./test/out/inject/css/1-inject.css').toString();
    assert.equal(style2.replace('\r\n', '\n'), 'div { background: #aaa; }\n');
  });
});
