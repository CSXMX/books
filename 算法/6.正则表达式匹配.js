// https://leetcode.cn/problems/regular-expression-matching/description/
var isMatch = function (s, p) {
  if (s == null || p === null) return false;
  const m = s.length,
    n = p.length;
  let dp = Array.from(Array(m + 1), () => Array(n + 1).fill(false));
  dp[0][0] = true;
  // 第一轮考虑s为空串的情况，作为基础数据
  for (let j = 1; j <= n; j++) {
    if (p[j - 1] === "*") {
      // 一个*，代表一切，不用遍历
      if (j === 1) {
        return true;
      } else {
        // * 和 a* 都可以表示空字符串，因为*前面的字符串可以是0次
        // j = 2时，p[1] = '*',
        dp[0][j] = dp[0][j - 2];
      }
    }
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === p[j - 1] || p[j - 1] === ".") {
        dp[i][j] = dp[i - 1][j - 1];
      } else if (p[j - 1] === "*") {
        if (s[i - 1] === p[j - 2] || p[j - 2] === ".") {
          //这行代码处理的是模式字符串p的第j个字符是*的情况，它对应了以下三种情况：
          //dp[i][j - 2]：这种情况对应于*操作符使得前面的元素出现0次。例如，对于字符串s="a"和模式p="ab*"，我们可以忽略b*，使得模式匹配空字符串。
          //dp[i - 1][j - 2]：这种情况对应于*操作符使得前面的元素出现1次。例如，对于字符串s="ab"和模式p="ab*"，我们可以匹配一个b，使得模式匹配ab。
          // dp[i - 1][j]：这种情况对应于*操作符使得前面的元素出现多次。例如，对于字符串s="abbb"和模式p="ab*"，我们可以匹配多个b，使得模式匹配abbb。
          dp[i][j] = dp[i][j - 2] || dp[i - 1][j - 2] || dp[i - 1][j];
        } else {
          // 忽略前面的字符串，次数为0
          dp[i][j] = dp[i][j - 2];
        }
      }
    }
  }
  return dp[m][n];
};
