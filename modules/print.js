const printValue = (value) => `${value}`;

const printExpression = (left, right, operation) =>
  `(${left.toString()} ${operation} ${right.toString()})`;

module.exports = {
  printValue,
  printExpression,
};
