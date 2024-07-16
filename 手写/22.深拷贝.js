// 真精简版
function deepClone(obj, map = new WeakMap()) {
  if (obj == null || typeof obj !== "object") {
    return obj;
  }
  if (map.has(obj)) {
    return map.get(obj);
  }
  let cloneObj;
  if (Array.isArray(obj)) {
    cloneObj = [];
  } else if (obj instanceof Date) {
    cloneObj = new Date(obj);
  } else if (obj instanceof RegExp) {
    cloneObj = new RegExp(obj.source, obj.flags);
  } else if (obj instanceof Map) {
    cloneObj = new Map();
    for (const [key, value] of obj) {
      cloneObj.set(key, deepClone(value, map));
    }
  } else if (obj instanceof Set) {
    cloneObj = new Set();
    for (const value of obj) {
      cloneObj.add(deepClone(value, map));
    }
  } else {
    cloneObj = Object.create(Object.getPrototypeOf(obj));
  }

  map.set(obj, cloneObj);

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloneObj[key] = deepClone(obj[key], map);
    }
  }

  return cloneObj;
}
// const timer = new Date();
// const res = deepClone(timer);
// console.log(timer)
// console.log(res)

let a = [1, 3, 5];
for (let key in a) {
  if (Object.prototype.hasOwnProperty.call(a, key)) {
    console.log(key);
  }
}
