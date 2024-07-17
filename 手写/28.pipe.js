const pipe =
  (...functions) =>
  (input) =>
    functions.reduce((result, func) => func(result), input);

const add = (x) => x + 5;
const multiply = (x) => x * 2;
const subtract = (x) => x - 3;

const pipeline = pipe(add, multiply, subtract);
const result = pipeline(10); // 先加5，然后乘以2，最后减3
console.log(result); // 输出 27

const compose =
  (...functions) =>
  (input) =>
    functions.reduceRight((result, func) => func(result), input);

// 在上述示例中，`pipe` 和 `compose` 函数分别创建了管道和组合，可以将多个函数连接在一起，
// 按照指定的顺序执行它们。这样的抽象允许您以一种更清晰和模块化的方式组织函数调用，提高代码的可读性和可维护性。
