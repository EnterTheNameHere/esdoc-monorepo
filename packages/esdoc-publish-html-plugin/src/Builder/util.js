import marked from 'marked';
import highlightjs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';

/**
 * Highlights `code` as a source code of `language`, JavaScript as default, returning html representation.
 * @param  {string} code                    Source code to highlight.
 * @param  {string} [language='JavaScript'] Language of source code.
 * @return {string}                         Highlighted source code as html.
 */
export function highlight(code, language = 'JavaScript') {
    if(!code || code === '' || typeof code !== 'string') return '';
    
    const validLanguage = highlightjs.getLanguage(language) ? language : 'JavaScript';
    return highlightjs.highlight( code, { language: validLanguage } ).value;
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

  /* eslint-disable no-control-regex */
  const regexp = new RegExp('^<caption>(.*?)</caption>\n', 'u');
  const matched = example.match(regexp);
  if (matched) {
    body = example.replace(regexp, '');
    body = highlight(body, 'JavaScript').value;
    caption = matched[1].trim();
  }
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
