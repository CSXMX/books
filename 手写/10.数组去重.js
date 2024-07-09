function quchong1(arr) {
  const newArr = [];
  arr.reduce((pre, next) => {
    if (pre[next] == null) {
      pre[next] = 1;
      newArr.push(next);
    }
    return pre;
  }, {});
  return newArr;
}
function quchong2(arr) {
  return [...new Set(arr)];
}
function quchong3(arr) {
  let map = new Map();
  arr = arr.filter((item) => {
    if (map.has(item)) {
      return false;
    } else {
      map.set(item, 1);
      return true;
    }
  });
  return arr;
}
function quchong4(arr) {
  //原地去重
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1);
      }
    }
  }
  return arr;
}
function quchong5(arr) {
  //indexof第一个索引值
  return arr.filter((item, index, arr) => {
    return arr.indexOf(item, 0) === index;
  });
}
function quchong6(arr) {
  //includes
  return arr.reduce((pre, cur) => {
    if (pre.includes(cur)) {
      return pre;
    } else {
      return [...pre, cur];
    }
  }, []);
}
console.log(quchong6([1, 2, 3, 3, 5, 4, 2, 1]));
