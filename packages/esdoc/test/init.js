const fs = require('fs-extra');
const path = require('path');
const ESDocCLI = require('@enterthenamehere/esdoc/out/ESDocCLI').default;

function run_esdoc_cli(configPath) {
    const cliPath = path.resolve('./node_modules/@enterthenamehere/esdoc/out/ESDocCLI.js');
    const argv = ['node', cliPath];
    
    if(configPath) {
        configPath = path.resolve(configPath);
        argv.push('-c', configPath);
    }
    
    const esdoc_cli = new ESDocCLI(argv);
    esdoc_cli.exec();
}

run_esdoc_cli('./test/src/integration-test/esdoc.json');
global.docs = JSON.parse( fs.readFileSync('./test/src/integration-test/out/index.json').toString() );
