const assert = require('assert');
const fs = require('fs');
const cheerio = require('cheerio');

describe('test inject script result:', function () {
  it('has injected script tag title', function () {
    const html = fs.readFileSync('./test/out/index.html').toString();
    const $ = cheerio.load(html);
    assert.equal($('script[src="./inject/script/0-inject.js"]').length, 1);
  });

  it('has injected scripts', function () {
    const script = fs.readFileSync('./test/out/inject/script/0-inject.js').toString();
    assert.equal(script.replace('\r\n', '\n'), "console.log('this is injected script');\n");
    const script2 = fs.readFileSync('./test/out/inject/script/1-inject.js').toString();
    assert.equal(script2.replace('\r\n', '\n'), "console.log('same name, but different folder');\n");
  });
});
