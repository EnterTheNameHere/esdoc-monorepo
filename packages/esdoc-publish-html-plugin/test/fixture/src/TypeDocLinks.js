export function ExportedFunctionNoParamsNoReturn() {
  return '';
}

export function ExportedFunctionOneParamNoReturn( paramOne ) {
  return '';
}

export function ExportedFunctionOneParamDefaultNoReturn( paramOne = 42 ) {
  return '';
}

export function ExportedFunctionTwoParamsNoReturn( paramOne, paramTwo ) {
  return '';
}

export function ExportedFunctionThreeParamsNoReturn( paramOne, paramTwo, paramThree ) {
  return '';
}

export function ExportedFunctionThreeParamsOneDefaultNoReturn( paramOne, paramTwo, paramThree = 42 ) {
  return '';
}

export function ExportedFunctionOneParamObjectNoReturn( paramOne = {first: '', second: 42} ) {
  return '';
}

export function ExportedFunctionOneParamArrayNoReturn( paramOne = ['first', 42] ) {
  return '';
}

export class TypeDocLinks {
  /**
   * @returns {string}
   * @public
   */
  FunctionNoParamsReturnString() {
    return '';
  }

  /**
   * @param {string} paramOne 
   * @returns {string}
   * @public
   */
  FunctionOneStringParamReturnString( paramOne ) {
    return '';
  }

  /**
   * @param {number} [paramOne=42] 
   * @returns {string}
   * @public
   */
  FunctionOneParamDefaultNumberReturnString( paramOne = 42 ) {
    return '';
  }

  /**
   * @param {number} paramOne 
   * @param {string} paramTwo 
   * @returns {string}
   * @public
   */
  FunctionTwoParamsNumberStringReturnString( paramOne, paramTwo ) {
    return '';
  }

  /**
   * @param {*} paramOne 
   * @param {number} paramTwo 
   * @param {any} paramThree 
   * @returns {*}
   * @public
   */
  FunctionThreeParamsAnyNumberAnyReturnAny( paramOne, paramTwo, paramThree ) {
    return '';
  }

  /**
   * @param {*} paramOne 
   * @param {any} paramTwo 
   * @param {number} [paramThree=42] 
   * @returns {number}
   * @public
   */
  FunctionThreeParamsAnyAnyNumberDefaultReturnNumber( paramOne, paramTwo, paramThree = 42 ) {
    return 42;
  }

  /**
   * @param {object} [paramOne={'',42}]
   * @param {string} [paramOne.first='']
   * @param {number} [paramOne.second=42] 
   * @returns {string}
   * @public
   */
  FunctionOneParamObjectDefaultReturnString( paramOne = {first: '', second: 42} ) {
    return '';
  }

  /**
   * @param {(string|number)[]} [paramOne] 
   * @returns {number}
   * @public
   */
  FunctionOneParamArrayDefaultReturnNumber( paramOne = ['first', 42] ) {
    return 42;
  }

  /**
   * @param {Map<string,number>} paramOne
   * @returns {Map<string,number>}
   * @public
   */
  FunctionMapParamMapReturn( paramOne ) {
    return paramOne;
  }

  /**
   * @param {(callback, value, id)} callback
   * @return {Promise(reject|resolve)}
   * @public
   */
  FunctionCallbackParamPromiseReturn( callback ) {
    return '';
  }

  /**
   * @param {function()} fn
   * @return {()}
   * @public
   */
  FunctionFnParamFnReturn( fn ) {
    return function(fn){ return 42; };
  }

  /**
   * @param {function(number):string} fn
   * @return {(number):number}
   * @public
   */
  FunctionFnNumberStringParamReturnFnNumberNumber( fn ) {
    return function(n=42){ return 42; };
  }
}
