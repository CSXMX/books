function flatten(arr) {
  return arr.reduce(function (prev, item) {
    return prev.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

function flatten2(arr) {
  while (arr.some(Array.isArray)) {
    arr = [].concat(...arr);
  }
  return arr;
}
function flatten3(arr) {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] instanceof Array) {
      res = res.concat(flatten3(arr[i]));
    } else {
      res.push(arr[i]);
    }
  }
  return res;
}
function flatten4(arr) {
  return arr.flat(Infinity);
}

const flat = (arr, depth = 1) => {
  const res = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      res.push(...flat(item, depth - 1));
    } else {
      res.push(item);
    }
  }
  return res;
};

console.log(flatten4([1, 2, [3, 4, [5, 6]]]));
