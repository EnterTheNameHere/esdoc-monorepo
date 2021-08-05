const path = require('path');
const ESDocCLI = require('@enterthenamehere/esdoc/out/ESDocCLI.js').default;

function cli() {
  const cliPath = path.resolve('./node_modules/@enterthenamehere/esdoc/out/ESDocCLI.js');
  const argv = ['node', cliPath, '-c', './test/fixture/esdoc.json'];
  const cli = new ESDocCLI(argv);
  cli.exec();
}

cli();
