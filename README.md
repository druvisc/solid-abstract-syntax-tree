# Refactoring an expression tree

Refactor and improve `tree.js` to use the SOLID principles.

# Implementation

## 1. Interface Segregation Principle

The current `Node` API breaks the SOLID interface segregation principle:

```js
const Node = (operator, value, left, right) => { .. };
```

It forces to pass an empty string for the `operator` parameter and `null` for the `left` and `right` nodes for the leaf (value) nodes and `null` for the `value` parameter for internal (operation) nodes:

```js
const valueNode1 = Node("", 4, null, null);
const valueNode2 = Node("", 2, null, null);

const divisionNode = Node("÷", null, valueNode1, valueNode2);
```

We can see that the each type of node accepts completely opposite parameters so their interfaces have to be segregated to make them smaller and more reasonable.

With the interfaces segregated, we no longer have to pass redundant properties to each type of node:

```js
const valueNode1 = Value(4);
const valueNode2 = Value(2);

const divisionNode = Divide(valueNode1, valueNode2);
```

## 2. Open/Closed Principle

Both the `switch` statement in the `result` method

```js
switch (operator) {
    case "+":
        return left.result() + right.result();
    case "-":
        return left.result() - right.result();
    case "x":
        return left.result() \* right.result();
    case "÷":
        return left.result() / right.result();
    default:
        return value;
}
```

and the `switch` statement in the `toString` method

```js
switch (operator) {
  case "+":
    return `(${left.toString()} + ${right.toString()})`;
  case "-":
    return `(${left.toString()} - ${right.toString()})`;
  case "x":
    return `(${left.toString()} x ${right.toString()})`;
  case "÷":
    return `(${left.toString()} ÷ ${right.toString()})`;
  default:
    return value.toString();
}
```

violate the SOLID open/closed principle.

To add a new expression (outside of the `Node` class), we have to modify the existing code (inside the `Node` class) - so it's not "closed off" and easily extendable. This also causes code to be harder to read, maintain and be more error-prone.

Instead of having these `switch` statements based on type (`operator`), they can be broken off in small, individual classes. To enforce class compatibility and for polymorphism to work, an interface containing both `result` and `toString` methods has to be implemented:

```ts
interface IResultable {
  result: () => number;
}

interface IPrintable {
  toString: () => string;
}
```

New node classes "implementing" both interfaces:

```js
const Value = (value) => ({
  value,
  result: () => value,
  toString: () => `${value}`,
});

const Add = (left, right) => ({
  left,
  right,
  result: () => left.result() + right.result(),
  toString: () => `(${left.toString()} + ${right.toString()})`,
});

const Subtract = (left, right) => ({
  left,
  right,
  result: () => left.result() - right.result(),
  toString: () => `(${left.toString()} - ${right.toString()})`,
});

const Multiply = (left, right) => ({
  left,
  right,
  result: () => left.result() * right.result(),
  toString: () => `(${left.toString()} * ${right.toString()})`,
});

const Divide = (left, right) => ({
  left,
  right,
  result: () => left.result() / right.result(),
  toString: () => `(${left.toString()} ÷ ${right.toString()})`,
});

const tree = Divide(
  Add(Value(7), Multiply(Subtract(Value(3), Value(2)), Value(5))),
  Value(6)
);
```

## 3. Encapsulation

The initial `Node` API implementation is missing any kind of encapsulation, exposing implementation details as every property and method is available:

```js
return {
  operator,
  value,
  left,
  right,
  result,
  toString,
};
```

The previously implemented interfaces indicate which methods need to be exposed for a consistent API, hiding the implementation details with the help of a closure:

```js
const Value = (value) => ({
  result: () => value,
  toString: () => `${value}`,
});

const Add = (left, right) => ({
  result: () => left.result() + right.result(),
  toString: () => `(${left.toString()} + ${right.toString()})`,
});

const Subtract = (left, right) => ({
  result: () => left.result() - right.result(),
  toString: () => `(${left.toString()} - ${right.toString()})`,
});

const Multiply = (left, right) => ({
  result: () => left.result() * right.result(),
  toString: () => `(${left.toString()} * ${right.toString()})`,
});

const Divide = (left, right) => ({
  result: () => left.result() / right.result(),
  toString: () => `(${left.toString()} ÷ ${right.toString()})`,
});
```

## 4. Single Responsibility Principle

Both the initial `Node` implementation and the one above violate the single responsibility principle of SOLID. The classes handle both the calculation logic (`result`) and the printing logic (`toString`). To avoid having to make changes to the classes when the printing logic changes, the printing logic should be factored out to a seperate module:

```js
const printValue = (value) => `${value}`;

const printExpression = (left, right, operation) =>
  `(${left.toString()} ${operation} ${right.toString()})`;

module.exports = {
  printValue,
  printExpression,
};
```

Importing and using the printing module means that if the printing logic changes, no changes to the classes will be required.

```js
const { printValue, printExpression } = require("./print");

const Value = (value) => ({
  result: () => value,
  toString: () => printValue(value),
});

const Add = (left, right) => ({
  result: () => left.result() + right.result(),
  toString: () => printExpression(left, right, "+"),
});

const Subtract = (left, right) => ({
  result: () => left.result() - right.result(),
  toString: () => printExpression(left, right, "-"),
});

const Multiply = (left, right) => ({
  result: () => left.result() * right.result(),
  toString: () => printExpression(left, right, "*"),
});

const Divide = (left, right) => ({
  result: () => left.result() / right.result(),
  toString: () => printExpression(left, right, "÷"),
});
```

## 5. Dependency Injection

Although the responsibility of calculation is now separated from printing with the help of the printing module, the two responsibilities are still coupled together as changing the printing method altogether will still cause changes to the class.

To avoid this, we can make the dependency easily switchable with a higher-order function:

```js
// Import or define new printing functions.

const makeValue = (toString) => (value) => ({
  result: () => value,
  toString: () => toString(value),
});

const makeAdd = (toString) => (left, right) => ({
  result: () => left.result() + right.result(),
  toString: () => toString(left, right, "+"),
});

const makeSubtract = (toString) => (left, right) => ({
  result: () => left.result() - right.result(),
  toString: () => toString(left, right, "-"),
});

const makeMultiply = (toString) => (left, right) => ({
  result: () => left.result() * right.result(),
  toString: () => toString(left, right, "x"),
});

const makeDivide = (toString) => (left, right) => ({
  result: () => left.result() / right.result(),
  toString: () => toString(left, right, "÷"),
});

// Pass the printing functions to the higher-order functions to create the classes.
const Value = makeValue(printValue);
const Add = makeAdd(printExpression);
const Subtract = makeSubtract(printExpression);
const Multiply = makeMultiply(printExpression);
const Divide = makeDivide(printExpression);

// The API hasn't changed.
const tree = Divide(
  Add(Value(7), Multiply(Subtract(Value(3), Value(2)), Value(5))),
  Value(6)
);
```

## 6. Input validation

Following point 4 and point 5, for input validaiton we can create a separate validation module:

```js
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
```

Which then gets imported and injected through the same higher-order functions:

```js
const {
  validateValue,
  validateExpressio,
  validateDivide,
} = require("./validation");

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

// Pass in the additional argument for validation to the higher-order functions.
const Value = makeValue(validateValue, printValue);
const Add = makeAdd(validateExpression, printExpression);
const Subtract = makeSubtract(validateExpression, printExpression);
const Multiply = makeMultiply(validateExpression, printExpression);
const Divide = makeDivide(validateDivide, printExpression);

// The API hasn't changed.
const tree = Divide(
  Add(Value(7), Multiply(Subtract(Value(3), Value(2)), Value(5))),
  Value(6)
);
```

## Testing

See `test.js` for the test cases.

## Running

Main:

`node index.js`

Tests:

`node test.js`
