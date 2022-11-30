// import("./util").then(({
//   add
// }) => {
//   console.log(add(1, 2));
// });
import {
    add,
    deepClone
} from '@/test/util.js'
let a = {
    name: "lcq"
}
let c = deepClone(a);
console.log(add(3, 4));
delete a.name;
console.log(c);