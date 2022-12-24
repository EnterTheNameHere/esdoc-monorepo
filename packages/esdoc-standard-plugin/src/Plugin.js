
console.log('__filename', __filename, '__dirname', __dirname);

class Plugin {
  onInitialize(initializeEvent, option) {
    if(!option) option = {};
    initializeEvent.PluginManager.registerPlugin({name: '@enterthenamehere/esdoc-lint-plugin', option: option.lint});
    initializeEvent.PluginManager.registerPlugin({name: '@enterthenamehere/esdoc-coverage-plugin', option: option.coverage});
    initializeEvent.PluginManager.registerPlugin({name: '@enterthenamehere/esdoc-accessor-plugin', option: option.accessor});
    initializeEvent.PluginManager.registerPlugin({name: '@enterthenamehere/esdoc-type-inference-plugin', option: option.typeInference});
    initializeEvent.PluginManager.registerPlugin({name: '@enterthenamehere/esdoc-ecmascript-proposal-plugin', option: option.ecmascriptProposal});
    initializeEvent.PluginManager.registerPlugin({name: '@enterthenamehere/esdoc-external-ecmascript-plugin'});
    initializeEvent.PluginManager.registerPlugin({name: '@enterthenamehere/esdoc-brand-plugin', option: option.brand});
    initializeEvent.PluginManager.registerPlugin({name: '@enterthenamehere/esdoc-undocumented-identifier-plugin', option: option.undocumentIdentifier});
    initializeEvent.PluginManager.registerPlugin({name: '@enterthenamehere/esdoc-unexported-identifier-plugin', option: option.unexportedIdentifier});
    initializeEvent.PluginManager.registerPlugin({name: '@enterthenamehere/esdoc-integrate-manual-plugin', option: option.manual});
    initializeEvent.PluginManager.registerPlugin({name: '@enterthenamehere/esdoc-integrate-test-plugin', option: option.test});
    initializeEvent.PluginManager.registerPlugin({name: '@enterthenamehere/esdoc-publish-html-plugin'});
  }

  onHandlePlugins(/*ev*/) {
    // const option = ev.data.option || {};
    // const plugins = [
    //   {name: '@enterthenamehere/esdoc-lint-plugin', option: option.lint},
    //   {name: '@enterthenamehere/esdoc-coverage-plugin', option: option.coverage},
    //   {name: '@enterthenamehere/esdoc-accessor-plugin', option: option.accessor},
    //   {name: '@enterthenamehere/esdoc-type-inference-plugin', option: option.typeInference},
    //   {name: '@enterthenamehere/esdoc-external-ecmascript-plugin'},
    //   {name: '@enterthenamehere/esdoc-brand-plugin', option: option.brand},
    //   {name: '@enterthenamehere/esdoc-undocumented-identifier-plugin', option: option.undocumentIdentifier},
    //   {name: '@enterthenamehere/esdoc-unexported-identifier-plugin', option: option.unexportedIdentifier},
    //   {name: '@enterthenamehere/esdoc-integrate-manual-plugin', option: option.manual},
    //   {name: '@enterthenamehere/esdoc-integrate-test-plugin', option: option.test},
    //   {name: '@enterthenamehere/esdoc-publish-html-plugin'}
    // ];

    // const existPluginNames = ev.data.plugins.map((plugin) => { return plugin.name; });
    // for (const plugin of plugins) {
    //   if (existPluginNames.includes(plugin.name)) continue;
    //   if (plugin.option === undefined) delete plugin.option;
    //   ev.data.plugins.push(plugin);
    // }
  }
}

module.exports = new Plugin();
