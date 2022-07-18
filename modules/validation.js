const { number } = require("../utils");

const validateValue = (value) => {
  if (!number.isNumber(value)) {
    throw new Error(`The value "${value}" is not a numerical value!`);
  }
};

const validateExpression = (left, right, operation) => {
  if (!left?.result || !right?.result) {
    throw new Error(`The operation "${operation}" is missing an operand!`);
  }
};

const validateDivide = (left, right, operation) => {
  validateExpression(left, right, operation);

  if (right.result() === 0) {
    throw new Error(
      `The right-hand side operand "${right.toString()}" for Divide must be non-zero!`
    );
  }
};

module.exports = {
  validateValue,
  validateExpression,
  validateDivide,
};
