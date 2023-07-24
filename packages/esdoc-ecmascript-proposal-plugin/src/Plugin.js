class Plugin {
  getDefaultOptions() {
    return {
      all: true,
      classProperties: true,
      objectRestSpread: true,
      doExpressions: true,
      functionBind: true,
      functionSent: true,
      asyncGenerators: true,
      decorators: true,
      exportExtensions: true,
      dynamicImport: true,
    };
  }
  
  onHandleCodeParser(ev) {
    const option = ev.data.option;
    const parserPlugins = ev.data.parserOption.plugins;

    if (option.all || option.classProperties) parserPlugins.push('classProperties');
    if (option.all || option.objectRestSpread) parserPlugins.push('objectRestSpread');
    if (option.all || option.doExpressions) parserPlugins.push('doExpressions');
    if (option.all || option.functionBind) parserPlugins.push('functionBind');
    if (option.all || option.functionSent) parserPlugins.push('functionSent');
    if (option.all || option.asyncGenerators) parserPlugins.push('asyncGenerators');
    if (option.all || option.decorators) parserPlugins.push(['decorators', {decoratorsBeforeExport: true, legacy:true}]);
    if (option.all || option.exportExtensions) parserPlugins.push('exportExtensions');
    if (option.all || option.exportExtensions) parserPlugins.push('exportDefaultFrom');
    if (option.all || option.dynamicImport) parserPlugins.push('dynamicImport');
  }
}

module.exports = new Plugin();
