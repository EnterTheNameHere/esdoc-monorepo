console.log('>>>> __filename', __filename);

class Plugin {
  getDefaultOptions() {
    return {enable: false};
  }

  onHandleDocs(ev) {
    const option = ev.data.option;
    const ignore = !option.enable;
    // TODO: enabled plugin means ignore? Make this make sense... Rename it to hide - like what do you want to do with unexported identifiers? hide/remove etc.

    for (const doc of ev.data.docs) {
      if (doc.export === false && ignore && !('ignore' in doc))  {
        doc.ignore = ignore;
      }
    }
  }
}

module.exports = new Plugin();
