Function.prototype.call = function (context) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  let args = [...arguments].slice(1);
  context = context || window;
  context.fn = this;
  let res = context.fn(...args);
  delete context.fn;
  return res;
  // return 'hello'
};
Function.prototype.apply = function (context) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  context = context || window;
  context.fn = this;
  let res = null;
  if (arguments[1]) {
    res = context.fn(...arguments[1]);
  } else {
    res = context.fn();
  }
  delete context.fn;
  return res;
};
Function.prototype.bind = function (context) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  let fn = this;
  let args = [...arguments].slice(1);
  return function Fn() {
    return fn.apply(
      this instanceof Fn ? this : context,
      args.concat(...arguments)
    );
  };
};
/**
 * call、apply、bind是JavaScript中的三个函数，它们都可以用来改变函数的this指向。
call和apply的作用是一样的，都是用来调用函数并改变函数的this指向。它们的区别在于传参的方式不同。call的参数是一个一个传递的，而apply的参数是以数组的形式传递的。
bind函数则是用来创建一个新的函数，并且将原函数的this指向绑定到指定的对象上。bind函数不会立即执行原函数，而是返回一个新的函数，需要手动调用才会执行。
另外，call、apply、bind函数都可以用来实现函数的继承。通过改变函数的this指向，可以让子类继承父类的方法。

bind函数返回的是一个新的函数，如果使用new关键字调用这个新函数，那么this指向的是新创建的对象。
如果不使用new关键字调用这个新函数，那么this指向的是指定的对象或者调用bind函数时传入的this值。
 */
