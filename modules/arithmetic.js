const makeValue = (validateValue, toString) => (value) => {
    validateValue(value);
  
    return {
      result: () => value,
      toString: () => toString(value),
    };
  };
  
  const makeAdd = (validateExpression, toString) => (left, right) => {
    const operation = "+";
  
    validateExpression(left, right, operation);
  
    return {
      result: () => left.result() + right.result(),
      toString: () => toString(left, right, operation),
    };
  };
  
  const makeSubtract = (validateExpression, toString) => (left, right) => {
    const operation = "-";
  
    validateExpression(left, right, operation);
  
    return {
      result: () => left.result() - right.result(),
      toString: () => toString(left, right, operation),
    };
  };
  
  const makeMultiply = (validateExpression, toString) => (left, right) => {
    const operation = "x";
  
    validateExpression(left, right, operation);
  
    return {
      result: () => left.result() * right.result(),
      toString: () => toString(left, right, operation),
    };
  };
  
  const makeDivide = (validateDivide, toString) => (left, right) => {
    const operation = "÷";
  
    validateDivide(left, right, operation);
  
    return {
      result: () => left.result() / right.result(),
      toString: () => toString(left, right, operation),
    };
  };
  
  module.exports = {
    makeValue,
    makeAdd,
    makeSubtract,
    makeMultiply,
    makeDivide,
  };
  