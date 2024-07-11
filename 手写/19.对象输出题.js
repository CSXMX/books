let a = {};
let b = {};

a[b] = 1;

let c = { d: 2 };
a[c] = 2;
console.log(a[c], a[b], a[{}]);
