https://leetcode.cn/problems/container-with-most-water/
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    let res = 0;
    let l = 0, r = height.length - 1;
    while(l <= r){
        res = Math.max(res, Math.min(height[l],height[r]) * (r - l));
        if(height[l] < height[r]){
            l++;
        }else{
            r--;
        }
    }
    return res;
};