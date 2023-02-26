console.log('>>>> __filename', __filename);

class Plugin {
  getDefaultOptions() {
    return {enable: true};
  }

  onHandleDocs(ev) {
    const option = ev.data.option;
    const ignore = !option.enable;

    for (const doc of ev.data.docs) {
      if (doc.export === false && ignore && !('ignore' in doc))  {
        doc.ignore = ignore;
      }
    }
  }
}

module.exports = new Plugin();
