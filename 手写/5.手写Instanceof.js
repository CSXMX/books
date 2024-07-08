function instanceOf(father, child) {
  const fp = father.prototype;
  let cp = Object.getPrototypeOf(child);
  if (cp == null || fp == null) {
    return false;
  } else if (cp === fp) {
    return true;
  } else {
    return instanceOf(fp, cp);
  }
}
function myinstanceof(father, child) {
  const fp = father.prototype;
  var cp = Object.getPrototypeOf(child);
  while (cp) {
    if (cp === fp) {
      return true;
    }
    cp = Object.getPrototypeOf(cp);
  }
  return false;
}
class Father {
  constructor(name) {
    this.name = name;
  }
}
let p = new Father("hhh");
console.log(instanceOf(Father, p));
