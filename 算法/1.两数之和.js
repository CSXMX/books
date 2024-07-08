// https://leetcode.cn/problems/two-sum/
var twoSum = function (nums, target) {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const value = nums[i];
    if (map.has(value)) {
      return [i, map.get(value)];
    } else {
      map.set(target - value, i);
    }
  }
};
