console.log('>>>> __filename', __filename);

class Plugin {
  getDefaultOptions() {
    return {
      autoPrivate: true,
      access: ["public", "protected", "private"],
    };
  }
  
  onHandleDocs(ev) {
    const option = ev.data.option;
    
    for (const doc of ev.data.docs) {
      if (!doc.access) {
        if (option.autoPrivate && doc.name && doc.name.charAt(0) === '_') {
          doc.access = 'private';
        } else {
          doc.access = 'public';
        }
      }
      
      if (!option.access.includes(doc.access)) doc.ignore = true;
    }
  }
}

module.exports = new Plugin();
