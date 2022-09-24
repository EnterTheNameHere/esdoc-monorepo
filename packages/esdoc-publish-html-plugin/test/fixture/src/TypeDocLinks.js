export function FunctionNoParamsNoReturn() {
}

export function FunctionOneParamNoReturn( paramOne ) {
}

export function FunctionOneParamDefaultNoReturn( paramOne = 42 ) {
}

export function FunctionTwoParamsNoReturn( paramOne, paramTwo ) {
}

export function FunctionThreeParamsNoReturn( paramOne, paramTwo, paramThree ) {
}

export function FunctionThreeParamsOneDefaultNoReturn( paramOne, paramTwo, paramThree = 42 ) {
}

export function FunctionOneParamObjectNoReturn( paramOne = {first: '', second: 42} ) {
}

export function FunctionOneParamArrayNoReturn( paramOne = ['first', 42] ) {
}

/**
 * @returns {string}
 * @public
 */
export function FunctionNoParamsReturnString() {
  return '';
}

/**
 * @param {string} paramOne 
 * @returns {string}
 * @public
 */
export function FunctionOneStringParamReturnString( paramOne ) {
  return '';
}

/**
 * @param {number} [paramOne=42] 
 * @returns {string}
 * @public
 */
export function FunctionOneParamDefaultNumberReturnString( paramOne = 42 ) {
  return '';
}

/**
 * @param {number} paramOne 
 * @param {string} paramTwo 
 * @returns {string}
 * @public
 */
export function FunctionTwoParamsNumberStringReturnString( paramOne, paramTwo ) {
  return '';
}

/**
 * @param {*} paramOne 
 * @param {number} paramTwo 
 * @param {any} paramThree 
 * @returns {*}
 * @public
 */
export function FunctionThreeParamsAnyNumberAnyReturnAny( paramOne, paramTwo, paramThree ) {
  return '';
}

/**
 * @param {*} paramOne 
 * @param {any} paramTwo 
 * @param {number} [paramThree=42] 
 * @returns {number}
 * @public
 */
export function FunctionThreeParamsAnyAnyNumberDefaultReturnNumber( paramOne, paramTwo, paramThree = 42 ) {
  return 42;
}

/**
 * @param {object} [paramOne={'',42}]
 * @param {string} [paramOne.first='']
 * @param {number} [paramOne.second=42] 
 * @returns {string}
 * @public
 */
export function FunctionOneParamObjectDefaultReturnString( paramOne = {first: '', second: 42} ) {
  return '';
}

/**
 * @param {[]} [paramOne] 
 * @returns {number}
 * @public
 */
export function FunctionOneParamArrayDefaultReturnNumber( paramOne = ['first', 42] ) {
  return 42;
}

/**
 * @param {Map<string,number>} paramOne
 * @returns {Map<string,number>}
 * @public
 */
export function FunctionMapParamMapReturn( paramOne ) {
  return paramOne;
}

/**
 * @param {function(callback, value, id)} callback
 * @return {Promise(reject,resolve)}
 * @public
 */
export function FunctionCallbackParamPromiseReturn( callback ) {
  return '';
}

/**
 * @param {function()} fn
 * @return {function()}
 * @public
 */
export function FunctionFnParamFnReturn( fn ) {
  return function(fn){ return 42; };
}

/**
 * @param {function(number):string} fn
 * @return {function(number):number}
 * @public
 */
export function FunctionFnNumberStringParamReturnFnNumberNumber( fn ) {
  return function(n=42){ return 42; };
}

/**
 * @returns {number} - description for return here
 */
export function TestCustomParserOne() {
  return 42;
}

/**
 * @returns {(number|string)} - description for return here
 */
export function TestCustomParserTwo(random=0) {
  if(random) {
    return 'string';
  }
  return 42;
}

/**
 * @returns {number|string} - description for return here
 */
export function TestCustomParserTwoAndHalf(random=0) {
  if(random) {
    return 'string';
  }
  return 42;
}

/**
 * @param {number} [random=0] - description for parameter
 * @returns {(number|string)} - description for return here
 */
export function TestCustomParserThree(random=0) {
  if(random) {
    return 'string';
  }
  return 42;
}

/**
 * @param {(number|string)} random - description for parameter
 * @returns {(number|string)} - description for return here
 */
export function TestCustomParserFour(random) {
  if(typeof random === 'string') {
    return 'string';
  }
  return 42;
}

/**
 * @param {function(paramOne: Map<string,number>, paramTwo: {propOne: string, propTwo: number}, ...rest)} dummy 
 */
export function TestCustomParserFive(dummy) {

}

/**
 * @param {function(first: function(secondOne: Map<string,number>, secondTwo: {propOne: Element, propTwo: function(three: Element[])}))} dummy 
 */
 export function TestCustomParserSix(dummy) {

}

/**
 * @param {   function   (first: function   (   secondOne: Map <       string, number     >,       secondTwo: {      propOne: Element,propTwo: function( three:       Element []    )}   )      )   } dummy 
 */
export function TestCustomParserSeven(dummy) {

}

/**
 * @param {  function (    ) something wrong} dummy 
 */
export function TestCustomParserEight(dummy) {
}





// TODO: Following is taken from various third party code to test JSDoc examples.
// TODO: Move into their own test cases, some needs code in different files for import/export.

/**
 * @typedef {{name: "John", lastName: "Doe", age: "infinite"}} MyComplicatedObject
 */
/**
 * @returns {Promise<MyComplicatedObject>}
 */
export function TestCustomParserNine() {
}

// Where YOUR_TYPE is understood type (either naturally inferred, or through JSDoc)

/**
 * @param {any} value
 * @return {value is YOUR_TYPE}
 */
export function isYourType(value) {
	let isType;
	/**
	 * Do some kind of logical testing here
	 * - Always return a boolean
	 */
	return isType;
}

/**
 * @typedef {object} DestructuredUser
 * @property {string} userName
 * @property {number} age
 */
/** @type {DestructuredUser} */
const {userName, age} = getUser2();

/**
 * @param {object} obj
 * @param {string} obj.userName
 * @param {number} obj.age 
 */
 export function logUser1({userName, age}){
	console.log(`User ${userName} is ${age} years old.`);
}

/**
 * @typedef {object} DestructuredUser
 * @property {string} userName
 * @property {number} age
 */
/** @param {DestructuredUser} param */
export function logUser2({userName, age}){
	console.log(`User ${userName} is ${age} years old.`);
}

/**
 * @typedef {function(string): string} StringProcessor1
 */

// It is far easier to write as a multi-line typedef with arg names
/**
 * @typedef {function} StringProcessor2
 * @param {string} inputStr - String to transform
 * @returns {string} Transformed string
 */

/**
 * @typedef {object} Person
 * @property {string} name
 * @property {number} age
 */
 
/**
 * Works!
 */
 const success = /** @type {Person} */ (/** @type {unknown} */ (something))

 /**
  * FAILS
  */
 /** @type {Person} */
 const failed = (something);
 
 /**
 * Takes any object with a name prop and removes it
 * @template T
 * @param {T & {name?: string}} inputObj
 * @returns {Omit<T, 'name'>}
 */
const deleteName = (inputObj) => {
	/** @type {typeof inputObj} */
	const copy = JSON.parse(JSON.stringify(inputObj));
	delete copy.name;
	return copy;
}

// IDE will automatically infer type of T, and also infer the
// type of nameLess as {age: number, name: string} without `name`
const nameLess = deleteName({
	age: 50,
	name: 'Gregory'
});

/** @typedef {[string, number]} NameAgeTuple */

/** @type {NameAgeTuple} */
const Robert = ['Robert Smith', 45];

/** @typedef {['Espresso', 'Drip']} CoffeeLiteralTuple */
// Above could also be written as `{readonly ['Espresso', 'Drip']}`

/** @type {CoffeeLiteralTuple & string[]} */
const coffeeTypes = ['Espresso', 'Drip'];
coffeeTypes.push('Cold Brew');

/** @typedef {['Dog', 'Cat', 'Bird']} PetsAllowedInLeaseTuple */

/** @type {PetsAllowedInLeaseTuple} */
const AllowedPets = ['Dog', 'Cat', 'Bird'];

/**
 * @param {PetsAllowedInLeaseTuple[number]} petType - Union pet type, extracted from tuple
 * @param {string} name
 */
const addPetToLease = (petType, name) => {
	//...
}

addPetToLease('Bird', 'Tweety');

// Basic string literal
/** @typedef {'v1.0'} VersionString */

// String literal union
/** @typedef {'cat' | 'dog'} Pet */

// (string) template literal type
// Expands to `cat-collar`, `cat-food_bowl`, `dog-collar`, `dog-food_bowl`
/** @typedef {`${Pet}-${'collar' | 'food_bowl'}`} Accessory */

const AppInfo = /** @type {const} */ ({
	appName: 'Widget Factory',
	author: 'Joshua',
});

/**
 * @type {import('fs').Stats}
 */
 let fsStats;

 // Or, via typedef
 /** @typedef {import('unist').Node} AstNode */

 /**
 * @typedef {typeof import('../my-js-file')['myExportedFunc']} MyFunc
 */

 /**
 * @typedef {'pinball' | 'skee-ball' | 'ddr' | 'whack-a-mole'} GameName
 */

/**
 * Get an adjusted point total, based on game weight and house rules
 *  - Make sure to pass un-adjusted scores
 * @example
 * ```js
 * const adjusted = getAdjustedTotal({
 *    ddr: 2500,
 *    "whack-a-mole": 10
 * }).adjustedTotal;
 * ```
 * @param {Partial<Record<GameName, number>>} gameHistory
 * @returns {{total: number, adjustedTotal: number, avgWeight: number}} totals
 */
function getAdjustedTotal(gameHistory) {
  // implementation details omitted
}

/**
 * @type {google.maps.StreetViewPanorama}
 */
 let pano = this.mapObjs.svPano;

 /**
  * @type Array<{localPath:string, fullPath: string}>
  */
 let filePaths = [];
 
 /**
  * @typedef {"Hello" | "World"} MyStringOptions
  */
 
 // You can even re-use types!
 /**
  * @typedef {object} Person
  * @property {string} name - Person's preferred name
  * @property {number} age - Age in years
  * @property {boolean} likesCilantro - Whether they like cilantro
  * @property {string} [nickname] - Optional: Nickname to use
  */
 
 
 /**
  * @type Person
  */
 let phil = {
   name: 'Phil Mill',
   age: 25,
   likesCilantro: true
 }
 
 /**
  * @type Person
  */
 let bob = {
   name: 'Robert Smith',
   age: 30,
   likesCilantro: true,
   nickname: 'Bob'
 }
 
 /**
  * 
  * @param {Person} personObj 
  */
 function analyzePerson(personObj){
   // Intellisense will fully know the type of personObj!
   console.log(personObj.name);
 }
 
 // File alpha.js
/** @typedef {{username: string, isAdmin: boolean, age?: number}} User */

// This is an empty export to illustrate that `alpha.js` is a module.
export {}

// File beta.js
/** @type {import('./alpha.js').User} */
const joe = {
	username: 'Joseph',
	isAdmin: false,
	age: 85
}

/**
 * @typedef {{ value: number }} MyObj
 * @param {{ label?: string, rest: ...MyObj }} props
 */

 const MyTextInput = ({ label, ...rest }) => {}
