function throttle(fn, wait = 1000) {
  let timer = null;
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, wait);
    }
  };
}
function throttle2(fn, wait = 1000) {
  let lastTime = new Date();
  return function (...args) {
    let curTime = new Date();
    if (curTime - lastTime >= wait) {
      fn.apply(this, args);
      lastTime = curTime;
    }
  };
}
