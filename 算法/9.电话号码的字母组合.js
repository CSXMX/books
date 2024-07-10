var letterCombinations = function (digits) {
  if (digits.length == 0) {
    return [];
  }
  let map = new Map([
    ["2", "abc"],
    ["3", "def"],
    ["4", "ghi"],
    ["5", "jkl"],
    ["6", "mno"],
    ["7", "pqrs"],
    ["8", "tuv"],
    ["9", "wxyz"],
  ]);
  let res = [];
  const dfs = (inx, path) => {
    if (inx === digits.length) {
      res.push(path);
      return;
    }
    for (let ch of map.get(digits[inx])) {
      dfs(inx + 1, path + ch);
    }
  };
  dfs(0, "");
  return res;
};
console.log(letterCombinations("32"));
