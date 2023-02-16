import { expect } from "chai";
import {MockESDocTestEnvironment, helperRunScriptAsync} from '../../../esdocMock';

describe( 'test/Plugin/PluginManager', function () {
    it('detects requested plugin cannot be found', async function () {
        const mockEnv = new MockESDocTestEnvironment();
        mockEnv.writeToJSONFile('package.json', {
            name: 'Test',
            version: '1.0.0'
        });
        mockEnv.writeToJSONFile('.esdoc.json', {
            source: 'src',
            destination: 'docs',
            plugins: [
                {
                    name: 'non-existent-plugin',
                    options: {
                        test: '3'
                    }
                }
            ]
        });
        
        const result = await helperRunScriptAsync( mockEnv._ESDocCLIPath, '', mockEnv._directoryPath );
        let message = result.std.err.join('');
        
        // Remove coloration
        // eslint-disable-next-line no-control-regex
        message = message.replaceAll( /\x1B\[[0-9]+;?[0-9]?m?/gu, '' );
        
        const regExp1 = /Error! Plugin named '.*non-existent-plugin' cannot be found!/u;
        const regExp2 = /Try running 'npm install --save-dev .*non-existent-plugin' to install the plugin./u;
        
        expect( message.search(regExp1) ).to.not.equal(-1);
        expect( message.search(regExp2) ).to.not.equal(-1);

        mockEnv.clean();
    });
});
