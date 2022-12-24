const AbstractBuilder = require('./AbstractBuilder');
const IceCap = require('@enterthenamehere/ice-cap').default;

console.log('__filename', __filename, '__dirname', __dirname);

class ClassBuilder extends AbstractBuilder {
  makeHTML() {
    const docs = this._findAll({kind: 'class'});
    const outputs = [];

    for (const doc of docs) {
      const ice = new IceCap(this._readTemplate('class.html'));

      this._applyBody(doc, ice);
      this._applyConstructor(doc, ice);
      this._applyMember(doc, ice);
      this._applyMethod(doc, ice);

      outputs.push(ice.html);
    }

    return outputs.join('\n');
  }

  _applyBody(classDoc, ice) {
    ice.text('className', `\`${classDoc.name}\``);
    ice.text('classDesc', classDoc.description);
  }

  _applyConstructor(classDoc, ice) {
    const constructorDoc = this._find({kind: 'constructor', memberof: classDoc.longname});
    if (constructorDoc) {
      ice.text('constructorSignature', this._makeSignature(constructorDoc));
      ice.text('constructorDesc', constructorDoc.description);
    }
  }

  _applyMember(classDoc, ice) {
    const memberDocs = this._findAll({kind: 'member', memberof: classDoc.longname});
    ice.loop('member', memberDocs, (index, doc, ice2) => {
      ice2.text('memberSignature', this._makeSignature(doc));
      ice2.text('memberDesc', doc.description);
    });
  }

  _applyMethod(classDoc, ice) {
    const methodDocs = this._findAll({kind: 'method', memberof: classDoc.longname});
    ice.loop('method', methodDocs, (index, doc, ice2) => {
      ice2.text('methodSignature', this._makeSignature(doc));
      ice2.text('methodDesc', doc.description);

      const params = doc.params || [];
      ice2.loop('methodParam', params, (index2, param, ice3) => {
        ice3.text('name', param.name);
        ice3.text('type', param.types.join('|'));
        ice3.text('attribute', this._makeParamAttribute(param) || ' ');
        ice3.text('desc', param.description);
      });
    });
  }
}

module.exports = ClassBuilder;
