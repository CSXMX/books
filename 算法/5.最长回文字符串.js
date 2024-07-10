// https://leetcode.cn/problems/longest-palindromic-substring/description/

var longestPalindrome = function (s) {
  let n = s.length;
  let dp = new Array(n + 1).fill(0).map(() => Array(n + 1).fill(0));
  let maxi = (maxj = 0);
  let res = 0;
  // dp[i + 1][j - 1] -> dp[i][j]
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j <= n - 1; j++) {
      if (s[i] === s[j]) {
        if (j - i <= 1) {
          dp[i][j] = j - i + 1;
        } else {
          dp[i][j] = dp[i + 1][j - 1] > 0 ? dp[i + 1][j - 1] + 2 : 0;
        }
        if (res < dp[i][j]) {
          res = dp[i][j];
          maxi = i;
          maxj = j;
        }
      }
    }
  }
  return s.slice(maxi, maxj + 1);
};
console.log(longestPalindrome("abba"));
