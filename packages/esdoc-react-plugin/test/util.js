const fs = require('fs');
const cheerio = require('cheerio');

module.exports.load = function(fileName) {
  const html = fs.readFileSync(fileName, {encoding: 'utf-8'});
  return cheerio.load(html, { _useHtmlParser2: true, emptyAttrs: false }, false);
};

module.exports.text = function($el, query) {
    // TODO: What is this?
    if(query === 'tbody tr:nth-child(2)') {
        console.error('found (this is printed only during tests, it\'t not forgotten console message)');
        console.error('el: ', $el, 'text: ', $el.find(query).text());
    }
  return $el.find(query).text().replace(/\s+/g, ' ').trim();
};
