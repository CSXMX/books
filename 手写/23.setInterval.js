function preciseSetInterval(callback, delay) {
  let expected = Date.now() + delay;
  let timeout;
  function tick() {
    const drift = Date.now() - expected;
    callback();
    expected += delay;
    timeout = setTimeout(tick, delay - drift);
  }
  timeout = setTimeout(tick, delay);
}
