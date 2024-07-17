class myPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(func) {
    this.PromiseState = myPromise.PENDING;
    this.PromiseResult = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    try {
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(result) {
    if (this.PromiseState === myPromise.PENDING) {
      this.PromiseState = myPromise.FULFILLED;
      this.PromiseResult = result;
      this.onFulfilledCallbacks.forEach((callback) => {
        callback(result);
      });
    }
  }

  reject(reason) {
    if (this.PromiseState === myPromise.PENDING) {
      this.PromiseState = myPromise.REJECTED;
      this.PromiseResult = reason;
      this.onRejectedCallbacks.forEach((callback) => {
        callback(reason);
      });
    }
  }
  then(onFulfilled, onRejected) {
    function resolvePromise(promise2, x, resolve, reject) {
      if (x === promise2) {
        throw new TypeError("Chaining cycle detected for promise");
      }

      if (x instanceof myPromise) {
        x.then((y) => {
          resolvePromise(promise2, y, resolve, reject);
        }, reject);
      } else {
        resolve(x);
      }
    }

    let promise2 = new myPromise((resolve, reject) => {
      if (this.PromiseState === myPromise.FULFILLED) {
        setTimeout(() => {
          try {
            if (typeof onFulfilled !== "function") {
              resolve(this.PromiseResult);
            } else {
              let x = onFulfilled(this.PromiseResult);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.PromiseState === myPromise.REJECTED) {
        setTimeout(() => {
          try {
            if (typeof onRejected !== "function") {
              reject(this.PromiseResult);
            } else {
              let x = onRejected(this.PromiseResult);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.PromiseState === myPromise.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onFulfilled !== "function") {
                resolve(this.PromiseResult);
              } else {
                let x = onFulfilled(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (e) {
              reject(e);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onRejected !== "function") {
                reject(this.PromiseResult);
              } else {
                let x = onRejected(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });

    return promise2;
  }

  static resolve(value) {
    if (value instanceof myPromise) {
      return value;
    } else {
      return new myPromise((resolve) => {
        resolve(value);
      });
    }
  }

  static reject(reason) {
    return new myPromise((resolve, reject) => {
      reject(reason);
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  finally(callBack) {
    return this.then(callBack, callBack);
  }

  static all(promises) {
    return new myPromise((resolve, reject) => {
      if (Array.isArray(promises)) {
        let result = []; // 存储结果
        let count = 0; // 计数器
        if (promises.length === 0) {
          return resolve(promises);
        }

        promises.forEach((item, index) => {
          myPromise.resolve(item).then(
            (value) => {
              count++;
              result[index] = value;
              count === promises.length && resolve(result);
            },
            (reason) => {
              reject(reason);
            }
          );
        });
      } else {
        return reject(new TypeError("Argument is not iterable"));
      }
    });
  }

  static allSettled(promises) {
    return new myPromise((resolve, reject) => {
      if (Array.isArray(promises)) {
        let result = []; // 存储结果
        let count = 0; // 计数器
        if (promises.length === 0) return resolve(promises);
        promises.forEach((item, index) => {
          myPromise.resolve(item).then(
            (value) => {
              count++;
              result[index] = {
                status: "fulfilled",
                value,
              };
              count === promises.length && resolve(result);
            },
            (reason) => {
              count++;
              result[index] = {
                status: "rejected",
                reason,
              };
              count === promises.length && resolve(result);
            }
          );
        });
      } else {
        return reject(new TypeError("Argument is not iterable"));
      }
    });
  }
  static any(promises) {
    return new myPromise((resolve, reject) => {
      if (Array.isArray(promises)) {
        let errors = []; //
        let count = 0; // 计数器

        if (promises.length === 0)
          return reject(new AggregateError([], "All promises were rejected"));

        promises.forEach((item) => {
          myPromise.resolve(item).then(
            (value) => {
              resolve(value);
            },
            (reason) => {
              count++;
              errors.push(reason);
              count === promises.length &&
                reject(
                  new AggregateError(errors, "All promises were rejected")
                );
            }
          );
        });
      } else {
        return reject(new TypeError("Argument is not iterable"));
      }
    });
  }

  static race(promises) {
    return new myPromise((resolve, reject) => {
      if (Array.isArray(promises)) {
        if (promises.length > 0) {
          promises.forEach((item) => {
            myPromise.resolve(item).then(resolve, reject);
          });
        }
      } else {
        return reject(new TypeError("Argument is not iterable"));
      }
    });
  }
}

myPromise.deferred = function () {
  let result = {};
  result.promise = new myPromise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};

const promise = new myPromise((resolve, reject) => {
  const randomNumber = Math.random();
  if (randomNumber > 0.5) {
    resolve("Success");
  } else {
    reject("Failure");
  }
}).then(
  (result) => console.log(result), // Success
  (error) => console.error(error) // Failure
);

module.exports = myPromise;

Promise.prototype.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    if (Array.isArray(promises)) {
      let res = [];
      let count = 0;
      if (promise.length === 0) {
        return resolve(promises);
      } else {
        promises.forEach((item, inx) => {
          Promise.resolve(item).then(
            (value) => {
              count++;
              res[inx] = value;
              count === promise.length && resolve(res);
            },
            (reason) => {
              reject(reason);
            }
          );
        });
      }
    } else {
      return reject(new TypeError("Argument is not iterable"));
    }
  });
};
Promise.prototype.myRace = function (promises) {
  return new Promise((resolve, reject) => {
    if (Array.isArray(promises)) {
      if (promise.length === 0) {
        return resolve(promises);
      } else {
        promises.forEach((item, inx) => {
          Promise.resolve(item).then(resolve, reject);
        });
      }
    } else {
      return reject(new TypeError("Argument is not iterable"));
    }
  });
};
