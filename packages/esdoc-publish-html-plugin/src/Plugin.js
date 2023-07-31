import path from 'path';
import IceCap from '@enterthenamehere/ice-cap';
import DocBuilder from './Builder/DocBuilder';
import StaticFileBuilder from './Builder/StaticFileBuilder.js';
import IdentifiersDocBuilder from './Builder/IdentifiersDocBuilder.js';
import IndexDocBuilder from './Builder/IndexDocBuilder.js';
import ClassDocBuilder from './Builder/ClassDocBuilder.js';
import SingleDocBuilder from './Builder/SingleDocBuilder.js';
import FileDocBuilder from './Builder/FileDocBuilder.js';
import SearchIndexBuilder from './Builder/SearchIndexBuilder.js';
import SourceDocBuilder from './Builder/SourceDocBuilder.js';
import TestDocBuilder from './Builder/TestDocBuilder.js';
import TestFileDocBuilder from './Builder/TestFileDocBuilder.js';
import ManualDocBuilder from './Builder/ManualDocBuilder.js';

class Plugin {
  getDefaultOptions() {
    return {
      template: null,
    };
  }

  onHandleDocs(ev) {
    this._docs = ev.data.docs;
  }

  onPublish(ev) {
    this._option = ev.data.option;
    this._globalOption = ev.data.globalOption;
    this._template = typeof this._option.template === 'string'
      ? path.resolve(process.cwd(), this._option.template)
      : path.resolve(__dirname, './html-template');
    ev.debug('template location:', this._template);
    this._exec(this._docs, ev.data.writeFile, ev.data.copyDir, ev.data.readFile);
  }

  _exec(docs, writeFile, copyDir, readFile) {
    IceCap.debug = Boolean(this._option.debug);
    
    //bad hack: for other plugin uses builder.
    DocBuilder.createDefaultBuilder = () => {
      return new DocBuilder(this._template, docs, this._globalOption);
    };

    let coverage = null;
    try {
      coverage = JSON.parse(readFile('coverage.json'));
    } catch (e) {
      // nothing
    }

    new IdentifiersDocBuilder(this._template, docs).exec(writeFile, copyDir);
    new IndexDocBuilder(this._template, docs).exec(writeFile, copyDir);
    new ClassDocBuilder(this._template, docs).exec(writeFile, copyDir);
    new SingleDocBuilder(this._template, docs).exec(writeFile, copyDir);
    new FileDocBuilder(this._template, docs).exec(writeFile, copyDir);
    new StaticFileBuilder(this._template, docs).exec(writeFile, copyDir);
    new SearchIndexBuilder(this._template, docs).exec(writeFile, copyDir);
    new SourceDocBuilder(this._template, docs).exec(writeFile, copyDir, coverage);
    new ManualDocBuilder(this._template, docs).exec(writeFile, copyDir, readFile);

    const testsExist = docs.find((doc) => { return doc.kind.indexOf('test') === 0; });
    if (testsExist) {
      new TestDocBuilder(this._template, docs).exec(writeFile, copyDir);
      new TestFileDocBuilder(this._template, docs).exec(writeFile, copyDir);
    }
  }
}

module.exports = new Plugin();
