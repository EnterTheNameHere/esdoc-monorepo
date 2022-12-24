import { marked } from 'marked';
import cheerio from 'cheerio';
import prismjs from 'prismjs';
const loadLanguages = require('prismjs/components/');
import sanitizeHtml from 'sanitize-html';

console.log('__filename', __filename, '__dirname', __dirname);

/**
 * Highlights `code` as a source code of `language`, javascript as default, returning html.
 * 
 * If `language` is not recognized by highlighter, javascript will be chosen.
 * 
 * @param  {string} code                    Source code to highlight.
 * @param  {string} [language='javascript'] Language of source code.
 * @return {string}                         Highlighted source code as html.
 */
export function highlight(code, language = 'javascript' ) {
  if(!code || code === '' || typeof code !== 'string') return '';
  if(!language || language === '' || typeof language !== 'string') language = 'javascript';
  if( !Object.hasOwnProperty.call( prismjs.languages, language ) ) language = 'javascript';

  if( language.toLowerCase() === 'javascript' ) {
    // Load languages which can appear in javascript
    loadLanguages(['flow', 'jsx', 'tsx', 'typescript', 'js-extras', 'jsdoc']);
  }
  
  return prismjs.highlight( code, prismjs.languages[language], language );
}

/**
 * Sanitizes `html` by removing unapproved Html tags and attributes.
 *
 * @param  {string} html Html code to sanitize
 * @return {string}      Sanitized Html code
 */
export function sanitize(html) {
    if(!html || typeof html !== 'string') return '';
    
    const allowedTags = [
        'a',
        'br',
        'code',
        'div', 'details', 'del',
        'h1', 'h2', 'h3', 'h4', 'h5', 'hr',
        'img',
        'kbd',
        'li', 'ul', 'ol',
        'p', 'pre',
        'span', 'strong', 'summary',
        'table', 'thead', 'tbody', 'th', 'td', 'tr'
    ];
    const allowedAttributes = {
        '*': ['src', 'href', 'title', 'class', 'id', 'name', 'width', 'height', 'target', 'style'],
        'td': ['align']
    };
    const sanitized = sanitizeHtml( html, {
        allowedTags: allowedTags,
        allowedAttributes: allowedAttributes,
        disallowedTagsMode: 'escape'
    });
    
    return sanitized;
}

/**
 * shorten description.
 * e.g. ``this is JavaScript. this is Java.`` => ``this is JavaScript.``.
 *
 * @param {DocObject} doc - target doc object.
 * @param {boolean} [asMarkdown=false] - is true, test as markdown and convert to html.
 * @returns {string} shorten description.
 * @todo shorten before process markdown.
 */
export function shorten(doc, asMarkdown = false) {
  if (!doc) return '';

  if (doc.summary) return doc.summary;

  const desc = doc.descriptionRaw;
  if (!desc) return '';

  let len = desc.length;
  let inSQuote = false;
  let inWQuote = false;
  let inCode = false;
  for (let i = 0; i < desc.length; i++) {
    const char1 = desc.charAt(i);
    const char2 = desc.charAt(i + 1);
    const char4 = desc.substr(i, 6);
    const char5 = desc.substr(i, 7);
    if (char1 === '\'') inSQuote = !inSQuote;
    else if (char1 === '"') inWQuote = !inWQuote;
    else if (char4 === '<code>') inCode = true;
    else if (char5 === '</code>') inCode = false;

    if (inSQuote || inCode || inWQuote) continue;

    if (char1 === '.') {
      if (char2 === ' ' || char2 === '\n' || char2 === '<') {
        len = i + 1;
        break;
      }
    } else if (char1 === '\n' && char2 === '\n') {
      len = i + 1;
      break;
    }
  }

  let result = desc.substr(0, len);
  if (asMarkdown) {
    result = markdown(result);
  }

  return result;
}

/**
 * convert markdown text to html.
 * @param {string} text - markdown text.
 * @param {boolean} [breaks=false] if true, break line. FYI gfm is not breaks.
 * @return {string} html.
 */
export function markdown(text, breaks = false) {
  // original render does not support multi-byte anchor
  const renderer = new marked.Renderer();
  renderer.heading = function (text2, level) {
    const id = escapeURLHash(text2);
    return `<h${level} id="${id}">${text2}</h${level}>`;
  };
  
  const compiled = marked(text, {
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: breaks,
    highlight: function(code,language) {
      return `<code class="source-code prettyprint">${highlight(code,language)}</code>`;
    }
  });
  
  return sanitize(compiled);
}

/**
 * get UTC date string.
 * @param {Date} date - target date object.
 * @returns {string} UTC date string(yyyy-mm-dd hh:mm:ss)
 */
export function dateForUTC(date) {
  function pad(num, len) {
    const count = Math.max(0, len - `${num}`.length);
    return '0'.repeat(count) + num;
  }

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1, 2);
  const day = pad(date.getUTCDay() + 1, 2);
  const hours = pad(date.getUTCHours(), 2);
  const minutes = pad(date.getUTCMinutes(), 2);
  const seconds = pad(date.getUTCSeconds(), 2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} (UTC)`;
}

/**
 * parse ``@example`` value.
 * ``@example`` value can have ``<caption>`` tag.
 *
 * @param {string} example - target example value.
 * @returns {{body: string, caption: string}} parsed example value.
 */
export function parseExample(example) {
  let body = example;
  let caption = '';

  const regexp = /^<caption>(.*?)<\/caption>\n/u;
  const matched = body.match(regexp);
  if (matched) {
    body = body.replace(matched[0], '');
    caption = matched[1].trim();
  }
  body = highlight(body, 'JavaScript');
  return {body, caption};
}

/**
 * escape URL hash.
 * @param {string} hash - URL hash for HTML a tag and id tag
 * @returns {string} escaped URL hash
 */
export function escapeURLHash(hash) {
  return hash.toLowerCase().replace(/[~!@#$%^&*()_+=[\]\\{}|;':"<>?,./ ]/gu, '-');
}

/**
 * 
 * @param {string} content 
 * @returns 
 */
export function addLineNumbersToSourceCode(content='') {
  // Only if content is valid and not empty...
  if( !content || typeof content !== 'string' || content === '' ) return '';

  const normalizedNL = content.replace(/\r\n/gu,'\n'); // if we feed \r\n to highlightjs, it acts weird
  const highlighted = highlight(normalizedNL);             // make the source code colorful with html tags and css
  const contentInsideOL = `<ol class="linenums">${highlighted}</ol>`; // to display line numbers on the left
  const cheerioOptions = {
      withDomLvl1: true,
      normalizeWhiteSpace: false,
      xmlMode: false,
      decodeEntities: true,
      _useHtmlParser2: true,
      emptyAttrs: false
  };
  const $ = cheerio.load(contentInsideOL, cheerioOptions, false);
  
  // First we need to make sure every child tag which has multiple lines is split and each line has opening and closing tag.
  // So this:
  //    <span class="comment">line\n
  //    another line\n
  //    third</span>\n
  // Will become this:
  //    <span class="comment">line</span>\n
  //    <span class="comment">another line</span>\n
  //    <span class="comment">third</span>\n
  $('ol[class="linenums"] > *').each( function( i, elem ) { // eslint-disable-line prefer-arrow-callback
      const currentHtml = $(elem).html(); // use html(), since it keeps child tags while text() removes them

      if( currentHtml.includes('\n') ) {
          const lines = currentHtml.split('\n');
          const length = lines.length;
          const cssClass = $(elem).attr('class'); // Make sure all the tags have the same css class(es)
          
          for( let ii = 0; ii < length; ii = ii + 1 ) { // We need to mutate array contents, that's why not for..of
              lines[ii] = `<span class="${cssClass}">${lines[ii]}</span>`;
          }

          const newHtml = lines.join('\n'); // Remember to put that newline back, it's needed later...
          $(elem).html(newHtml);
      }
  });
  
  // Now add <li> and </li> to every line, so
  // <ol class="linenums">line one,\n
  // line two\n
  // line three\n
  // or\n
  // <span class="comment">comment line one</span>\n
  // <span class="comment">comment line two</span>\n
  // </ol>
  // will become:
  // <ol class="linenums"><li ...>line one</li><li ...>line two</li><li ...>line three</li><li ...>or</li><li ...><span class="comment">comment line one</span></li><li ...><span class="comment">comment line two</span></li></ol>
  // yes, the missing linebreaks are *feature*... The code would be in <pre><code> tags which preserves whitespace
  const oldHtml = $('ol[class="linenums"]').html();
  const codeLines = oldHtml.split('\n');
  const length = codeLines.length;
  for( let ii = 0; ii < length; ii = ii + 1 ) {
      codeLines[ii] = `<li id="lineNumber${ii+1}" class="L${ii}">${codeLines[ii]}</li>`;
  }
  
  const newHtml = codeLines.join(''); // Remember, no newlines...
  
  $('ol[class="linenums"]').html(newHtml);
  return $('ol').html();
}
