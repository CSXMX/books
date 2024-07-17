function get(source, path, defaultValue = undefined) {
  // a[3].b -> a.3.b -> [a,3,b]
  // path 中也可能是数组的路径，全部转化成 . 运算符并组成数组
  const paths = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  console.log(paths); // ["a", "0", "b"]
  let result = source; //这个result一直都是for循环中下一个key的上个节点
  //循环字符串中的数组取最后一个
  for (const p of paths) {
    result = Object(result)[p];
    if (result == undefined) {
      return defaultValue;
    }
  }
  return result;
}
// 测试用例
console.log(get({ a: { b: [{ c: 5 }] } }, "a.b[0].c", 3)); // output: 1
