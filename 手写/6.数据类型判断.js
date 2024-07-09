console.log(Array.isArray(Array.from({ length: 1, 0: 1 })));
console.log(typeof null);
console.log([] instanceof Array);
console.log([].constructor.name);
console.log(Object.prototype.toString.call([]).slice(8, -1));
