function accurateSleep(ms, callback) {
  let start = Date.now();
  let remaining = ms;
  const loop = () => {
    remaining = ms - (Date.now() - start);
    if (remaining <= 0) {
      callback();
    } else {
      setTimeout(loop, remaining);
    }
  };
  loop();
}
console.time("补差时法");
accurateSleep(100, () => console.timeEnd("补差时法"));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function demo() {
  console.time("promise法");
  await sleep(100);
  console.timeEnd("promise法");
}

demo();

// function sleepForAnimationFrame(ms) {
//   const start = performance.now();
//   const end = start + ms;
//   const loop = (currentTime) => {
//     if (currentTime < end) {
//       requestAnimationFrame(loop);
//     } else {
//       console.timeEnd("requestAnimationFrame");
//     }
//   };
//   requestAnimationFrame(loop);
// }
// console.time("requestAnimationFrame");
// sleepForAnimationFrame(100);

console.time("while法");
const sleepTime = (wait = 100) => {
  let now = Date.now();
  while (Date.now() - now <= wait) {}
  console.timeEnd("while法");
};
sleepTime();
