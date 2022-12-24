const TurndownService = require('turndown');
const GitHubFlavouredMarkdown = require('turndown-plugin-gfm').gfm;
const ClassBuilder = require('./ClassBuilder');
const FunctionBuilder = require('./FunctionBuilder');

console.log('__filename', __filename, '__dirname', __dirname);

class Plugin {
  onHandleDocs(ev) {
    this._docs = ev.data.docs;
  }

  onPublish(ev) {

    // create builder
    const classBuilder = new ClassBuilder(this._docs);
    const functionBuilder = new FunctionBuilder(this._docs);

    // create html
    let html = '';
    html += `<h1>Class</h1>\n${classBuilder.makeHTML()}\n`;
    html += `<h1>Function</h1>\n${functionBuilder.makeHTML()}\n`;

    // to markdown
    const markdown = this._toMarkdown(html);

    // write file
    const filename = ev.data.option && ev.data.option.filename ? ev.data.option.filename : 'index.md';
    ev.data.writeFile(filename, markdown);
  }

  _toMarkdown(html) {
    const turndownService = new TurndownService({
      headingStyle: 'atx'
    });

    // We don't want to escape ` character, so unescape it
    const originalEscape = turndownService.escape;
    turndownService.escape = (str) => {
      str = originalEscape(str);
      str = str.replaceAll('\\`', '`');
      return str;
    };

    // div is using as wrapper. so remove self tag.
    //turndownService.addRule( 'div', {
    //  filter: ['div'],
    //  replacement: function ( content ) {
    //    return content;
    //  }
    //});

    turndownService.use( GitHubFlavouredMarkdown );
    return turndownService.turndown(html);
  }
}

module.exports = new Plugin();
