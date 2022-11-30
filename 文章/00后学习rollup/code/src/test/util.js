import _ from 'loadsh';
export const add = (a, b) => a + b;
export * from "../multi";

export const testSideEffect = (obj) => {
  console.log(obj.x);
};

export function deepClone(obj) {
  return _.cloneDeep(obj);
}