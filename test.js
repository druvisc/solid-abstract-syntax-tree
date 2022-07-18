const assert = require("assert");

const { arithmetic, validation, print } = require("./modules");

const { makeValue, makeAdd, makeSubtract, makeMultiply, makeDivide } =
  arithmetic;
const { validateValue, validateExpression, validateDivide } = validation;
const { printValue, printExpression } = print;

const Value = makeValue(validateValue, printValue);
const Add = makeAdd(validateExpression, printExpression);
const Subtract = makeSubtract(validateExpression, printExpression);
const Multiply = makeMultiply(validateExpression, printExpression);
const Divide = makeDivide(validateDivide, printExpression);

// describe('Value')
const value = Value(1);
// test('result returns correct value')
assert.strictEqual(1, value.result());
// test('toString returns correct string value')
assert.strictEqual("1", value.toString());
// test('throws on non-numerical input')
assert.throws(
  () => Value("abc"),
  new Error(`The value "abc" is not a numerical value!`)
);
assert.throws(
  () => Value(NaN),
  new Error(`The value "NaN" is not a numerical value!`)
);
assert.throws(
  () => Value(Infinity),
  new Error(`The value "Infinity" is not a numerical value!`)
);
//

// describe('Add')
const add = Add(Value(1), Value(2));
// test('result returns correct value')
assert.strictEqual(3, add.result());
// test('toString returns correct string value')
assert.strictEqual("(1 + 2)", add.toString());
// test('throws on left-hand side non-resultable input')
assert.throws(
  () => Add("abc", Value(2)),
  new Error(`The operation "+" is missing an operand!`)
);
// test('throws on right-hand side non-resultable input')
assert.throws(
  () => Add(Value(1), "abc"),
  new Error(`The operation "+" is missing an operand!`)
);
//

// describe('Subtract')
const subtract = Subtract(Value(1), Value(2));
// test('result returns correct value')
assert.strictEqual(-1, subtract.result());
// test('toString returns correct string value')
assert.strictEqual("(1 - 2)", subtract.toString());
// test('throws on left-hand side non-resultable input')
assert.throws(
  () => Subtract("abc", Value(2)),
  new Error(`The operation "-" is missing an operand!`)
);
// test('throws on right-hand side non-resultable input')
assert.throws(
  () => Subtract(Value(1), "abc"),
  new Error(`The operation "-" is missing an operand!`)
);
//

// describe('Multiply')
const multiply = Multiply(Value(1), Value(2));
// test('result returns correct value')
assert.strictEqual(2, multiply.result());
// test('toString returns correct string value')
assert.strictEqual("(1 x 2)", multiply.toString());
// test('throws on right-hand side non-resultable input')
assert.throws(
  () => Multiply("abc", Value(2)),
  new Error(`The operation "x" is missing an operand!`)
);
// test('throws on right-hand side non-resultable input')
assert.throws(
  () => Multiply(Value(1), "abc"),
  new Error(`The operation "x" is missing an operand!`)
);
//

// describe('Subtract')
const divide = Divide(Value(1), Value(2));
// test('result returns correct value')
assert.strictEqual(0.5, divide.result());
// test('toString returns correct string value')
assert.strictEqual("(1 ÷ 2)", divide.toString());
// test('throws on right-hand side non-resultable input')
assert.throws(
  () => Divide("abc", Value(2)),
  new Error(`The operation "÷" is missing an operand!`)
);
// test('throws on right-hand side non-resultable input')
assert.throws(
  () => Divide(Value(1), "abc"),
  new Error(`The operation "÷" is missing an operand!`)
);
// test('throws on right-hand side resultable zero')
assert.throws(
  () => Divide(Value(1), Value(0)),
  new Error(`The right-hand side operand "0" for Divide must be non-zero!`)
);
// test('throws on right-hand side resultable zero')
assert.throws(
  () => Divide(Value(1), Add(Subtract(Value(7), Value(8)), Value(1))),
  new Error(
    `The right-hand side operand "((7 - 8) + 1)" for Divide must be non-zero!`
  )
);
//
