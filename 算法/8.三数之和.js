var threeSum = function (nums) {
  if (!nums || nums.length < 3) {
    return [];
  }
  let res = [];
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) {
      break;
    }
    if (i > 0 && nums[i - 1] === nums[i]) {
      continue;
    }
    let l = i + 1,
      r = nums.length - 1;
    while (l < r) {
      const sum = nums[l] + nums[r] + nums[i];
      if (sum === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[++l]) {
          continue;
        }
        while (l < r && nums[r] === nums[--r]) {
          continue;
        }
      } else if (sum > 0) {
        r--;
      } else {
        l++;
      }
    }
  }
  return res;
};
