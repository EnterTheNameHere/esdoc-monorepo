
console.log('>>>> __filename', __filename);

class ESDocStandardPlugin {
  onInitialize(initializeEvent, options) {
    if(!options) options = {};
    initializeEvent.PluginManager.registerPlugin('@enterthenamehere/esdoc-lint-plugin', options.lint);
    initializeEvent.PluginManager.registerPlugin('@enterthenamehere/esdoc-coverage-plugin', options.coverage);
    initializeEvent.PluginManager.registerPlugin('@enterthenamehere/esdoc-accessor-plugin', options.accessor);
    initializeEvent.PluginManager.registerPlugin('@enterthenamehere/esdoc-type-inference-plugin', options.typeInference);
    initializeEvent.PluginManager.registerPlugin('@enterthenamehere/esdoc-ecmascript-proposal-plugin', options.ecmascriptProposal);
    initializeEvent.PluginManager.registerPlugin('@enterthenamehere/esdoc-external-ecmascript-plugin');
    initializeEvent.PluginManager.registerPlugin('@enterthenamehere/esdoc-brand-plugin', options.brand);
    initializeEvent.PluginManager.registerPlugin('@enterthenamehere/esdoc-undocumented-identifier-plugin', options.undocumentIdentifier);
    initializeEvent.PluginManager.registerPlugin('@enterthenamehere/esdoc-unexported-identifier-plugin', options.unexportedIdentifier);
    initializeEvent.PluginManager.registerPlugin('@enterthenamehere/esdoc-integrate-manual-plugin', options.manual);
    initializeEvent.PluginManager.registerPlugin('@enterthenamehere/esdoc-integrate-test-plugin', options.test);
    initializeEvent.PluginManager.registerPlugin('@enterthenamehere/esdoc-publish-html-plugin');
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

module.exports = new ESDocStandardPlugin();
