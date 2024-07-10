
function curry(...args) {
    // 最初没有数字，返回 0
    if (args.length === 0) {
        return 0;
    } else {
        const total = args.reduce((pre, cur) => (pre + cur), 0);
        return function (...nextargs) {
            // 截止条件
            if (nextargs.length === 0) {
                return total;
            } else {
                // 统计剩余参数
                return curry(total, ...nextargs);
            }
        }
    }
}
console.log('curry', curry(1, 3)(2, 3)())

const add = function (a, b, c) {
    return a + b + c;
};
// 只支持固定个数的科里化
const curryFix = function (fn) {
    return function curried(...args) {
        // 参数数量够了
        if (args.length >= fn.length) {
            return fn(...args);
        } else {
            // 参数合并
            return function (...args2) {
                return curried(...args, ...args2);
            };
        }
    };
};
const addCurry = curryFix(add);
console.log('curryFix', addCurry(1, 2)(3));
