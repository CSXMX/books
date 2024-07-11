console.log("start"); // 1
const p = new Promise((resolve, reject) => {
  console.log("promise start"); // 2
  resolve();
  console.log("promise end"); // 3
})
  .then(() => {
    console.log("promise1"); // 微任务push promise1,promise2
  })
  .then(() => {
    console.log("promise2");
  })
  .then(() => {
    console.log("promise3");
  });
const fn2 = async function () {
  console.log("fn2"); //5
  await fn3();
  console.log("fn2 end"); // 微任务push promise1,promise2,fn2 end"
};
const fn3 = async function () {
  console.log("fn3"); // 6
  await fn4();
};
const fn4 = async () => {
  console.log("fn4"); // 7
};
const fn = async function () {
  console.log("async"); // 4
  await fn2();
  console.log("end2"); // 微任务push promise1,promise2,fn2 end,end2"
};
fn();
console.log("end"); //8
