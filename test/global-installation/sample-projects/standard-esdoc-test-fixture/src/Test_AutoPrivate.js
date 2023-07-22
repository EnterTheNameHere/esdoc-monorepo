export default class Test_AutoPrivate {
  static _shouldBePrivateStatic = false;

  _instanceShouldBePrivate = [1,2,3,4,5];

  _methodShouldBePrivate() {
    return false;
  }
  
  get _getterShouldBePrivate() {
    return false;
  }
  
  *_generatorMethodShouldBePrivate() {
    for(let num of this.instanceShouldBePrivate) {
      yield num;
    }
  }
  
  static _staticMethodShouldBePrivate() {
    return false;
  }
}
