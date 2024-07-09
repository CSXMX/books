var findMedianSortedArrays = function (nums1, nums2) {
  let len1 = nums1.length,
    len2 = nums2.length;
  if (len1 > len2) {
    return findMedianSortedArrays(nums2, nums1);
  }
  let sum = len1 + len2;
  let start = 0,
    end = len1;
  let a, b;
  while (start <= end) {
    a = Math.floor((start + end) / 2);
    b = Math.floor((sum + 1) / 2) - a;
    // 最左边为-Infinity，最右边为 + Infinity
    const aLeft = a <= 0 ? -Infinity : nums1[a - 1];
    const bLeft = b <= 0 ? -Infinity : nums2[b - 1];
    const aRight = a >= len1 ? +Infinity : nums1[a];
    const bRight = b >= len2 ? +Infinity : nums2[b];
    if (aLeft > bRight) {
      end = a - 1;
    } else if (bLeft > aRight) {
      start = a + 1;
    } else {
      // [3] [1,2] 2
      // [1,2] [3,4] 2.5
      return sum % 2
        ? Math.max(aLeft, bLeft)
        : (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;
    }
  }
};
console.log(findMedianSortedArrays([1, 2], [3]));
