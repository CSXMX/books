const isObject = (obj) => {
  return typeof obj === "object" && obj !== null;
};
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }
  if (!isObject(obj1) || !isObject(obj2)) {
    return false;
  }
  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}
console.log(
  deepEqual(
    {
      a: 1,
      b: -1,
    },
    {
      b: -1,
      a: 1,
    }
  )
);
