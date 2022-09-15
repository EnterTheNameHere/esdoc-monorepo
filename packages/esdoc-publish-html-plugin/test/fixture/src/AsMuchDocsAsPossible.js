export class AsMuchAsDocsAsPossibleSuperClass {
  #privatePropertyOne = 1;
  #privatePropertyTwo = 2;
  
  static staticPropertyOne = 1;
  static staticPropertyTwo = 2;
  
  static staticMethodOne() {
    return 1;
  }
  static staticMethodTwo() {
    return 2;
  }

  constructor() {
    this.insideConstructorOne = 1;
    this.insideConstructorTwo = 2;
  }

  get getsetOne() {
    return this.insideConstructorOne;
  }
  get getsetTwo() {
    return this.insideConstructorTwo;
  }

  set getsetOne(value) {
    this.insideConstructorOne = value;
  }
  set getsetTwo(value) {
    this.insideConstructorTwo = value;
  }

  *generatorMethodOne() {
    for(const num of [1,2,3,4]) {
      yield num;
    }
  }
  *generatorMethodTwo() {
    for(const char of 'characters') {
      yield char;
    }
  }
}

const firstMixin = (Base) => {
  return class extends Base {
    methodFromFirstMixinOne() {}
    methodFromFirstMixinTwo() {}
  };
};

const secondMixin = (Base) => {
  return class extends Base {
    static staticPropertyFromSecondMixinOne = 1;
    static staticPropertyFromSecondMixinTwo = 2;
  };
};

export class AsMuchAsDocsAsPossibleClass extends firstMixin(secondMixin(AsMuchAsDocsAsPossibleSuperClass)) {
  #privatePropertyThree = 3;
  #privatePropertyFour = 4;
  
  static staticPropertyThree = 3;
  static staticPropertyFour = 4;
  
  static staticMethodThree() {
    return 3;
  }
  static staticMethodFour() {
    return 4;
  }

  constructor() {
    super();
    this.insideConstructorThree = 3;
    this.insideConstructorFour = 4;
  }

  get getsetThree() {
    return this.insideConstructorThree;
  }
  get getsetFour() {
    return this.insideConstructorFour;
  }

  set getsetThree(value) {
    this.insideConstructorThree = value;
  }
  set getsetFour(value) {
    this.insideConstructorFour = value;
  }

  *generatorMethodThree() {
    for(const num of [5,6,7,8]) {
      yield num;
    }
  }
  *generatorMethodFour() {
    for(const char of 'string') {
      yield char;
    }
  }
}
