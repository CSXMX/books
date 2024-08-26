Array.prototype.mymap = function (fn) {
    let arr = this;
    let res = []
    for (let i = 0; i < arr.length; i++) {
        res[i] = fn(arr[i], i, arr);
    }
    return res;
}

Array.prototype.customReduce = function (callback, initialValue) {
    let accumulator = initialValue !== undefined ? initialValue : this[0];
    const startIndex = initialValue !== undefined ? 0 : 1;
    for (let i = startIndex; i < this.length; i++) {
        accumulator = callback(accumulator, this[i], i, this);
    }
    return accumulator;
};
console.log([1, 2, 3].mymap((item, inx) => {
    return item + inx;
}))
