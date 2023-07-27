import { loadCheerio, assert, fileNameToDescription } from '../../util';

describe(fileNameToDescription(__filename, 'TestSourceCodeHighlightingCSS'), function () {
  it('tests class import path is styled', function () {
    const $ = loadCheerio('class/src/Abstract/Override.js~TestAbstractOverride.html');
    const importPartCodeElement = $('div[class="import-path"] pre[class="prettyprint"] code');

    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(0).html(), 'import' );
    assert.equal( $('span[class*="imports"] span[class*="maybe-class-name"]', importPartCodeElement).html(), 'TestAbstractOverride' );
    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(1).html(), 'from' );
    assert.equal( $('span a', importPartCodeElement).attr('href'), 'file/src/Abstract/Override.js.html#lineNumber6' );
  });

  it('tests class named import path is styled', function () {
    // This is named import, so check { and } are around TestListensFunctionEvent
    const $ = loadCheerio('class/src/Listens/Function.js~TestListensFunctionEvent.html');
    const importPartCodeElement = $('div[class="import-path"] pre[class="prettyprint"] code');

    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(0).html(), 'import' );
    assert.equal( $('span[class*="imports"] span[class*="punctuation"]', importPartCodeElement).eq(0).html(), '{' );
    assert.equal( $('span[class*="imports"] span[class*="maybe-class-name"]', importPartCodeElement).html(), 'TestListensFunctionEvent' );
    assert.equal( $('span[class*="imports"] span[class*="punctuation"]', importPartCodeElement).eq(1).html(), '}' );
    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(1).html(), 'from' );
    assert.equal( $('span a', importPartCodeElement).attr('href'), 'file/src/Listens/Function.js.html#lineNumber10' );
  });

  it('tests interface import path is styled', function () {
    let $ = loadCheerio('class/src/Interface/Definition.js~TestInterfaceDefinition.html');
    let importPartCodeElement = $('div[class="import-path"] pre[class="prettyprint"] code');
    
    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(0).html(), 'import' );
    assert.equal( $('span[class*="imports"] span[class*="maybe-class-name"]', importPartCodeElement).html(), 'TestInterfaceDefinition' );
    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(1).html(), 'from' );
    assert.equal( $('span a', importPartCodeElement).attr('href'), 'file/src/Interface/Definition.js.html#lineNumber5' );
  });

  it('tests interface named import path is styled', function () {
    // This is named import, so check { and } are around TestInterfaceImplementsInner
    const $ = loadCheerio('class/src/Interface/Implements.js~TestInterfaceImplementsInner.html');
    const importPartCodeElement = $('div[class="import-path"] pre[class="prettyprint"] code');

    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(0).html(), 'import' );
    assert.equal( $('span[class*="imports"] span[class*="punctuation"]', importPartCodeElement).eq(0).html(), '{' );
    assert.equal( $('span[class*="imports"] span[class*="maybe-class-name"]', importPartCodeElement).html(), 'TestInterfaceImplementsInner' );
    assert.equal( $('span[class*="imports"] span[class*="punctuation"]', importPartCodeElement).eq(1).html(), '}' );
    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(1).html(), 'from' );
    assert.equal( $('span a', importPartCodeElement).attr('href'), 'file/src/Interface/Implements.js.html#lineNumber22' );
  });

  it('tests function import path is styled', function () {
    const $ = loadCheerio('function/index.html');
    const h3Parent = $('h3[id="static-function-testLinkFunction"]').parent();
    const importPartCodeElement = $('div[class="import-path"] pre[class="prettyprint"] code', h3Parent);

    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(0).html(), 'import' );
    assert.equal( $('span[class*="imports"]', importPartCodeElement).html(), 'testLinkFunction' );
    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(1).html(), 'from' );
    assert.equal( $('span a', importPartCodeElement).attr('href'), 'file/src/Link/Function.js.html#lineNumber7' );
  });

  it('tests function named import path is styled', function () {
    const $ = loadCheerio('function/index.html');
    const h3Parent = $('h3[id="static-function-_testAccessFunctionAutoPrivate"]').parent();
    const importPartCodeElement = $('div[class="import-path"] pre[class="prettyprint"] code', h3Parent);

    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(0).html(), 'import' );
    assert.equal( $('span[class*="imports"] span[class*="punctuation"]', importPartCodeElement).eq(0).html(), '{' );
    assert.equal( $('span[class*="imports"]', importPartCodeElement).contents().eq(1).text(), '_testAccessFunctionAutoPrivate' );
    assert.equal( $('span[class*="imports"] span[class*="punctuation"]', importPartCodeElement).eq(1).html(), '}' );
    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(1).html(), 'from' );
    assert.equal( $('span a', importPartCodeElement).attr('href'), 'file/src/Access/Function.js.html#lineNumber22' );
  });

  it('tests variable import path is styled', function () {
    const $ = loadCheerio('variable/index.html');
    const h3Parent = $('h3[id="static-variable-testExportNewExpression"]').parent();
    const importPartCodeElement = $('div[class="import-path"] pre[class="prettyprint"] code', h3Parent);

    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(0).html(), 'import' );
    assert.equal( $('span[class*="imports"]', importPartCodeElement).html(), 'testExportNewExpression' );
    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(1).html(), 'from' );
    assert.equal( $('span a', importPartCodeElement).attr('href'), 'file/src/Export/NewExpression.js.html#lineNumber9' );
  });

  it('tests variable named import path is styled', function () {
    const $ = loadCheerio('variable/index.html');
    const h3Parent = $('h3[id="static-variable-testAccessVariablePublic"]').parent();
    const importPartCodeElement = $('div[class="import-path"] pre[class="prettyprint"] code', h3Parent);

    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(0).html(), 'import' );
    assert.equal( $('span[class*="imports"] span[class*="punctuation"]', importPartCodeElement).eq(0).html(), '{' );
    assert.equal( $('span[class*="imports"]', importPartCodeElement).contents().eq(1).text(), 'testAccessVariablePublic' );
    assert.equal( $('span[class*="imports"] span[class*="punctuation"]', importPartCodeElement).eq(1).html(), '}' );
    assert.equal( $('span[class*="keyword"]', importPartCodeElement).eq(1).html(), 'from' );
    assert.equal( $('span a', importPartCodeElement).attr('href'), 'file/src/Access/Variable.js.html#lineNumber6' );
  });

  it('tests example code is styled', function () {
    const $ = loadCheerio('function/index.html');
    const h3Parent = $('h3[id="static-function-testExampleFunction"]').parent();
    const exampleCodeElement = $('div[class="example-doc"] pre[class="prettyprint source-code"] code', h3Parent);

    assert.equal( $('span[class*="keyword"]', exampleCodeElement).html(), 'const' );
    assert.equal( exampleCodeElement.contents().eq(1).text(), ' foo ' );
    assert.equal( $('span[class*="operator"]', exampleCodeElement).html(), '=' );
    assert.equal( $('span[class*="number"]', exampleCodeElement).html(), '123' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).html(), ';' );
  });

  it('tests example code with caption is styled', function () {
    const $ = loadCheerio('class/src/Example/Caption.js~TestExampleCaption.html');
    const divExampleDoc = $('div[class="example-doc"]');
    const exampleCodeElement = $('pre[class="prettyprint source-code"] code', divExampleDoc);

    assert.equal( $('div[class="example-caption"]', divExampleDoc).html(), 'this is caption' );
    assert.equal( $('span[class*="keyword"]', exampleCodeElement).eq(0).html(), 'const' );
    assert.equal( exampleCodeElement.contents().eq(1).text(), ' foo ' );
    assert.equal( $('span[class*="operator"]', exampleCodeElement).eq(0).html(), '=' );
    assert.equal( $('span[class*="number"]', exampleCodeElement).eq(0).html(), '123' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).eq(0).html(), ';' );
    assert.equal( exampleCodeElement.contents().eq(6).text(), '\n' );
    assert.equal( $('span[class*="console"]', exampleCodeElement).html(), 'console' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).eq(1).html(), '.' );
    assert.equal( $('span[class*="function"]', exampleCodeElement).html(), 'log' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).eq(2).html(), '(' );
    assert.equal( exampleCodeElement.contents().eq(11).text(), 'foo' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).eq(3).html(), ')' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).eq(4).html(), ';' );
  });

  it('tests multiple example codes are styled', function () {
    const $ = loadCheerio('class/src/Example/Class.js~TestExampleClass.html');
    const divExampleDoc = $('div[class="example-doc"]');
    let exampleCodeElement = $('pre[class="prettyprint source-code"] code', divExampleDoc.eq(0));

    assert.equal( $('span[class*="keyword"]', exampleCodeElement).eq(0).html(), 'const' );
    assert.equal( exampleCodeElement.contents().eq(1).text(), ' foo ' );
    assert.equal( $('span[class*="operator"]', exampleCodeElement).eq(0).html(), '=' );
    assert.equal( $('span[class*="number"]', exampleCodeElement).eq(0).html(), '123' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).eq(0).html(), ';' );
    assert.equal( exampleCodeElement.contents().eq(6).text(), '\n' );
    assert.equal( $('span[class*="console"]', exampleCodeElement).html(), 'console' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).eq(1).html(), '.' );
    assert.equal( $('span[class*="function"]', exampleCodeElement).html(), 'log' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).eq(2).html(), '(' );
    assert.equal( exampleCodeElement.contents().eq(11).text(), 'foo' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).eq(3).html(), ')' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).eq(4).html(), ';' );

    exampleCodeElement = $('pre[class="prettyprint source-code"] code', divExampleDoc.eq(1));

    assert.equal( $('span[class*="keyword"]', exampleCodeElement).eq(0).html(), 'const' );
    assert.equal( exampleCodeElement.contents().eq(1).text(), ' bar ' );
    assert.equal( $('span[class*="operator"]', exampleCodeElement).eq(0).html(), '=' );
    assert.equal( $('span[class*="number"]', exampleCodeElement).eq(0).html(), '123' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).eq(0).html(), ';' );
    assert.equal( exampleCodeElement.contents().eq(6).text(), '\n' );
    assert.equal( $('span[class*="console"]', exampleCodeElement).html(), 'console' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).eq(1).html(), '.' );
    assert.equal( $('span[class*="function"]', exampleCodeElement).html(), 'log' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).eq(2).html(), '(' );
    assert.equal( exampleCodeElement.contents().eq(11).text(), 'bar' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).eq(3).html(), ')' );
    assert.equal( $('span[class*="punctuation"]', exampleCodeElement).eq(4).html(), ';' );
  });

  it('tests whole source code file is properly styled and lines are numbered', function () {
    const $ = loadCheerio('file/src/Export/Variable.js.html');
    const divContent = $('div[class="content"]');
    let olElement = $('pre[class="source-code line-number raw-source-code"] code[class="prettyprint linenums"] ol[class="linenums"]', divContent);

    // Multiline comments first line contains two spans, fragment of adding line numbers to source code; Not really a bug, but can be fixed...
    let index = 0;
    let liElement = olElement.children().eq(index);
    assert.equal( liElement.attr('id'), `lineNumber${index+1}` );
    assert.equal( liElement.hasClass(`L${index}`), true );
    assert.equal( $('span[class*="comment"] span[class*="comment"]', liElement).html(), '/**' );

    // Inside comment, @type or @property and other doc-tags should be highlighted too...
    // TODO: test more of doc-tags?
    index = 2;
    liElement = olElement.children().eq(index);
    assert.equal( liElement.attr('id'), `lineNumber${index+1}` );
    assert.equal( liElement.hasClass(`L${index}`), true );
    assert.equal( $('span[class*="comment"]', liElement).contents().eq(0).text(), ' * ' );
    assert.equal( $('span[class*="comment"] span[class*="keyword"]', liElement).html(), '@type' );
    assert.equal( $('span[class*="comment"] span[class*="class-name"] span[class*="punctuation"]', liElement).eq(0).html(), '{' );
    assert.equal( $('span[class*="comment"] span[class*="class-name"]', liElement).contents().eq(1).text(), 'Object' );
    assert.equal( $('span[class*="comment"] span[class*="class-name"] span[class*="punctuation"]', liElement).eq(1).html(), '}' );

    index = 3;
    liElement = olElement.children().eq(index);
    assert.equal( liElement.attr('id'), `lineNumber${index+1}` );
    assert.equal( liElement.hasClass(`L${index}`), true );
    assert.equal( $('span[class*="comment"]', liElement).contents().eq(0).text(), ' * ' );
    assert.equal( $('span[class*="comment"] span[class*="keyword"]', liElement).html(), '@property' );
    assert.equal( $('span[class*="comment"] span[class*="class-name"] span[class*="punctuation"]', liElement).eq(0).html(), '{' );
    assert.equal( $('span[class*="comment"] span[class*="class-name"]', liElement).contents().eq(1).text(), 'number' );
    assert.equal( $('span[class*="comment"] span[class*="class-name"] span[class*="punctuation"]', liElement).eq(1).html(), '}' );
    assert.equal( $('span[class*="comment"] span[class*="parameter"]', liElement).html(), 'p1' );
    assert.equal( $('span[class*="comment"]', liElement).contents().eq(6).text(), ' - this is p1.' );

    // More than one keyword
    index = 6;
    liElement = olElement.children().eq(index);
    assert.equal( liElement.attr('id'), `lineNumber${index+1}` );
    assert.equal( liElement.hasClass(`L${index}`), true );
    assert.equal( $('span[class*="keyword"]', liElement).eq(0).html(), 'export' );
    assert.equal( $('span[class*="keyword"]', liElement).eq(1).html(), 'default' );
    assert.equal( liElement.contents().eq(3).text(), ' testExportVariable1 ' );
    assert.equal( $('span[class*="operator"]', liElement).eq(0).html(), '=' );
    assert.equal( $('span[class*="punctuation"]', liElement).eq(0).html(), '{' );
    assert.equal( $('span[class*="punctuation"]', liElement).eq(1).html(), '}' );
    assert.equal( $('span[class*="punctuation"]', liElement).eq(2).html(), ';' );

    // More than one keyword plus number
    index = 12;
    liElement = olElement.children().eq(index);
    assert.equal( liElement.attr('id'), `lineNumber${index+1}` );
    assert.equal( liElement.hasClass(`L${index}`), true );
    assert.equal( $('span[class*="keyword"]', liElement).eq(0).html(), 'export' );
    assert.equal( $('span[class*="keyword"]', liElement).eq(1).html(), 'const' );
    assert.equal( liElement.contents().eq(3).text(), ' testExportVariable2 ' );
    assert.equal( $('span[class*="operator"]', liElement).eq(0).html(), '=' );
    assert.equal( $('span[class*="number"]', liElement).html(), '123' );
    assert.equal( $('span[class*="punctuation"]', liElement).eq(0).html(), ';' );

    // Single line comment
    index = 20;
    liElement = olElement.children().eq(index);
    assert.equal( liElement.attr('id'), `lineNumber${index+1}` );
    assert.equal( liElement.hasClass(`L${index}`), true );
    assert.equal( $('span[class*="comment"]', liElement).html(), '// this is undocument' );

    // More than one keyword plus dot operator
    index = 37;
    liElement = olElement.children().eq(index);
    assert.equal( liElement.attr('id'), `lineNumber${index+1}` );
    assert.equal( liElement.hasClass(`L${index}`), true );
    assert.equal( $('span[class*="keyword"]', liElement).eq(0).html(), 'export' );
    assert.equal( $('span[class*="keyword"]', liElement).eq(1).html(), 'const' );
    assert.equal( liElement.contents().eq(3).text(), ' testExportVariable7 ' );
    assert.equal( $('span[class*="operator"]', liElement).eq(0).html(), '=' );
    assert.equal( $('span[class*="keyword"]', liElement).eq(2).html(), 'new' );
    assert.equal( $('span[class*="class-name"]', liElement).contents().eq(0).text(), 'foo' );
    assert.equal( $('span[class*="punctuation"]', liElement).eq(0).html(), '.' );
    assert.equal( $('span[class*="class-name"]', liElement).contents().eq(2).text(), 'Bar' );
    assert.equal( $('span[class*="punctuation"]', liElement).eq(1).html(), '(' );
    assert.equal( $('span[class*="punctuation"]', liElement).eq(2).html(), ')' );
    assert.equal( $('span[class*="punctuation"]', liElement).eq(3).html(), ';' );
  });
});
