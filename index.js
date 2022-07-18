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

try {
  const tree = Divide(
    Add(Value(7), Multiply(Subtract(Value(3), Value(2)), Value(5))),
    Value(6)
  );

  assert.strictEqual("((7 + ((3 - 2) x 5)) ÷ 6)", tree.toString());
  assert.strictEqual(2, tree.result());
} catch (error) {
  console.log(error);
}
