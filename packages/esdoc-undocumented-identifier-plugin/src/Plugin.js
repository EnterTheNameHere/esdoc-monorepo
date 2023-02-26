console.log('>>>> __filename', __filename);

class Plugin {
  getDefaultOptions() {
    return {enable: true};
  }

  onHandleDocs(ev) {
    this._option = ev.data.option;

    const ignore = !this._option.enable;

    for (const doc of ev.data.docs) {
      if (doc.undocument === true && ignore && !('ignore' in doc))  {
        doc.ignore = ignore;
      }
    }
  }
}

module.exports = new Plugin();
