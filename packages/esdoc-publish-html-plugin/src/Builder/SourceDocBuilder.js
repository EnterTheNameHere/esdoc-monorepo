import IceCap from '@enterthenamehere/ice-cap';
import DocBuilder from './DocBuilder.js';
import {dateForUTC} from './util.js';
import { FileManager } from '@enterthenamehere/esdoc-core/lib/Util/FileManager';

/**
 * Source output html builder class.
 */
export default class SourceDocBuilder extends DocBuilder {
  exec(writeFile, copyDir, coverage) {
    this._coverage = coverage;
    const ice = this._buildLayoutDoc();
    const fileName = 'source.html';
    const baseUrl = this._getBaseUrl(fileName);
    const title = this._getTitle('Source');

    ice.attr('baseUrl', 'href', baseUrl);
    ice.load('content', this._buildSourceHTML());
    ice.text('title', title, IceCap.MODE_WRITE);

    writeFile(fileName, ice.html);
  }

  _generateSourceData() {
    const sourceData = {};
    sourceData.files = [];

    const docs = this._find({kind: 'file'});
    const coverage = (this._coverage) ? this._coverage.files : false;
    
    if(coverage) {
      sourceData.coverage = { expected: this._coverage.expectCount, actual: this._coverage.actualCount };
    } else {
      sourceData.coverage = false;
    }
    
    for(const doc of docs) {
      const sourceFileData = {};
      sourceFileData.filePath = doc.name;
      sourceFileData.numLines = doc.content.split('\n').length - 1;
      
      const stat = FileManager.getStat(doc.longname);
      sourceFileData.size = stat.size;
      sourceFileData.updated = dateForUTC(stat.ctime);
      
      const identifierDocs = this._find({
        longname: {left: `${doc.name}~`},
        kind: ['class', 'function', 'variable'],
      });

      sourceFileData.identifiers = identifierDocs.map((identifierDoc) => {
        return this._generateDocLinkData(identifierDoc.longname);
      });

      if(coverage && coverage[doc.name]) {
        const expected = coverage[doc.name].expectCount;
        const actual = coverage[doc.name].actualCount;
        sourceFileData.coverage = {
          expected: expected,
          actual: actual,
        };
        
        const undocumentedLinesString = coverage[doc.name].undocumentLines.sort().join(',');

        sourceFileData.fileLink = this._generateFileDocLinkData(doc);
        sourceFileData.fileLink.href = sourceFileData.fileLink.href.replace(/href=".*\.html"/u, `href="${this._getURL(doc)}#errorLines=${undocumentedLinesString}"`);
      } else {
        sourceFileData.coverage = false;
        sourceFileData.fileLink = this._generateFileDocLinkData(doc);
      }

      sourceData.files.push(sourceFileData);
    }

    return sourceData;
  }
  
  /**
   * build source list output html.
   * @returns {string} html of source list.
   * @private
   */
  _buildSourceHTML() {
    const ice = new IceCap(this._readTemplate('source.html'));
    const docs = this._find({kind: 'file'});
    let coverage = false;
    if (this._coverage) coverage = this._coverage.files;

    ice.drop('coverageBadge', !coverage);
    ice.attr('files', 'data-use-coverage', Boolean(coverage));

    if (coverage) {
      const actual = this._coverage.actualCount;
      const expect = this._coverage.expectCount;
      const coverageCount = `${actual}/${expect}`;
      ice.text('totalCoverageCount', coverageCount);
    }

    ice.loop('file', docs, (i, doc, ice2) => {
      const filePath = doc.name;
      const content = doc.content;
      const lines = content.split('\n').length - 1;
      const stat = FileManager.getStat(doc.longname);
      const date = dateForUTC(stat.ctime);
      let coverageRatio = '-';
      let coverageCount = -1;
      let undocumentLines = '';
      if (coverage && coverage[filePath]) {
        const actual = coverage[filePath].actualCount;
        const expect = coverage[filePath].expectCount;
        coverageRatio = `${Math.floor(100 * actual / expect)} %`;
        coverageCount = `${actual}/${expect}`;
        undocumentLines = coverage[filePath].undocumentLines.sort().join(',');
      } else {
        coverageRatio = '-';
      }

      const identifierDocs = this._find({
        longname: {left: `${doc.name}~`},
        kind: ['class', 'function', 'variable']
      });
      const identifiers = identifierDocs.map((doc2) => {
        return this._buildDocLinkHTML(doc2.longname);
      });

      if (undocumentLines) {
        const url = this._getURL(doc);
        const link = this._buildFileDocLinkHTML(doc).replace(/href=".*\.html"/u, `href="${url}#errorLines=${undocumentLines}"`);
        ice2.load('filePath', link);
      } else {
        ice2.load('filePath', this._buildFileDocLinkHTML(doc));
      }
      ice2.text('coverage', coverageRatio);
      ice2.text('coverageCount', coverageCount);
      ice2.text('lines', lines);
      ice2.text('updated', date);
      ice2.text('size', `${stat.size} byte`);
      ice2.load('identifier', identifiers.join('\n') || '-');
    });
    return ice.html;
  }
}
