function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}
function isHasCircle(obj) {
  let flag = false;
  let map = new Map();
  function loop(obj) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (isObject(value)) {
        if (map.has(value)) {
          flag = true;
          return;
        } else {
          map.set(value);
          loop(value);
        }
      }
    });
  }
  loop(obj);
  return flag;
}

let obj = {
  a: 1,
  b: 2,
};
obj["c"] = obj;
console.log("1", isHasCircle(obj));
obj["c"] = 1;
console.log("2", isHasCircle(obj));
