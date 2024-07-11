function mynew(fn, ...args) {
  let obj = {};
  Object.setPrototypeOf(obj, fn.prototype);
  let res = fn.apply(obj, args);
  return res instanceof Object ? res : obj;
}
// function myNew(constructor, ...args) {
//   const obj = Object.create(constructor.prototype);
//   obj.constructor = constructor;
//   let res = constructor.apply(obj, args);
//   return res instanceof Object ? res : obj;
// }
function customCreate(proto, propertiesObject) {
  function F() {}
  F.prototype = proto;
  let obj = new F();
  if (propertiesObject !== undefined) {
    Object.defineProperties(obj, propertiesObject);
  }
  return obj;
}
