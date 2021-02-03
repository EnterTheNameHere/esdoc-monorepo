import fs from 'fs-extra';
import path from 'path';
import ESDocCLI from '@enterthenamehere/esdoc/out/ESDocCLI';

export function run_esdoc_cli(configPath) {
    const cliPath = path.resolve('../node_modules/@enterthenamehere/esdoc/out');
    const argv = ['node', cliPath];

    if(configPath) {
        configPath = path.resolve(configPath);
        argv.push('-c', configPath);
    }
    
    const esdoc_cli = new ESDocCLI(argv);
    esdoc_cli.exec();
}

run_esdoc_cli('./test/integration-test/esdoc.json');
global.docs = JSON.parse( fs.readFileSync('./test/integration-test/out/index.json').toString() );
