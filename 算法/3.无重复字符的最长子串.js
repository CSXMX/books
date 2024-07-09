// https://leetcode.cn/problems/longest-substring-without-repeating-characters/?envType=featured-list&envId=2cktkvj?envType=featured-list&envId=2cktkvj
var lengthOfLongestSubstring = function (s) {
  const occ = new Set();
  let res = 0;
  let rk = 0;
  for (let i = 0; i < s.length; i++) {
    if (i > 0) {
      occ.delete(s[i - 1]);
    }
    while (rk < s.length && !occ.has(s[rk])) {
      occ.add(s[rk++]);
    }
    res = Math.max(res, rk - i);
  }
  return res;
};
console.log(lengthOfLongestSubstring("12334"));
