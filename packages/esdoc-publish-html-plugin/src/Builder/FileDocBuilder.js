import IceCap from '@enterthenamehere/ice-cap';
import DocBuilder from './DocBuilder.js';
import cheerio from 'cheerio';
import {highlight} from './util';

/**
 * File output builder class.
 */
export default class FileDocBuilder extends DocBuilder {
  exec(writeFile/*, copyDir*/) {
    const ice = this._buildLayoutDoc();

    const docs = this._find({kind: 'file'});
    for (const doc of docs) {
      const fileName = this._getOutputFileName(doc);
      const baseUrl = this._getBaseUrl(fileName);
      const title = this._getTitle(doc);
      ice.load('content', this._buildFileDoc(doc), IceCap.MODE_WRITE);
      ice.attr('baseUrl', 'href', baseUrl, IceCap.MODE_WRITE);
      ice.text('title', title, IceCap.MODE_WRITE);
      writeFile(fileName, ice.html);
    }
  }

  /**
   * build file output html.
   * @param {DocObject} doc - target file doc object.
   * @returns {string} html of file page.
   * @private
   */
    _buildFileDoc(doc) {
        let content = '';
        
        // Only if doc.content is valid and not empty...
        if( doc.content && typeof doc.content === 'string' && doc.content !== '' ) {
            const normalizedNL = doc.content.replace(/\r\n/gu,'\n'); // if we feed \r\n to highlightjs, it acts weird
            const highlighted = highlight(normalizedNL);             // make the source code colorful with html tags and css
            const contentInsideOL = `<ol class="linenums">${highlighted}</ol>`; // to display line numbers on the left
            const cheerioOptions = {
                withDomLvl1: true,
                normalizeWhiteSpace: false,
                xmlMode: false,
                decodeEntities: true
            };
            const $ = cheerio.load(contentInsideOL, cheerioOptions);
            
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
            content = $('body').html();
        }

        const ice = new IceCap(this._readTemplate('file.html'));
        ice.text('title', doc.name);
        ice.load('content', content);
        ice.drop('emptySourceCode', Boolean(doc.content));
        return ice.html;
  }
}
