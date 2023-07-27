export default class TestReturn {
  // literal
  methodLiteral(){
    return 123;
  }

  // array
  methodArray(){
    return [123, 456];
  }

  // object
  methodObject(){
    return {x1: 123, x2: 'text'};
  }

  // template literal
  methodTemplateLiteral(){
    return 'text';
  }

  methodObjectWithSpread(){
    const spread1 = ['a', 'b', 'c'];
    const spread2 = [1,2,3];
    return { ...spread1, ...spread2 };
  }
}
