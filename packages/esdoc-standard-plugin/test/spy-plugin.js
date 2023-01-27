const { default: PluginManager } = require("@enterthenamehere/esdoc/out/Plugin/PluginManager");

class SpyingPlugin {
  onStart() {
    this.pluginEntries = PluginManager.getPluginEntries();
  }
}

module.exports = new SpyingPlugin();
