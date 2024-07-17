function fetch(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(url);
    }, 1000);
  });
}
function* asyncGenerator() {
  const data1 = yield fetch("url1");
  console.log(data1); // 输出：url1
  const data2 = yield fetch("url2");
  console.log(data2); // 输出：url2
  const data3 = yield fetch("url3");
  console.log(data3); // 输出 url3
}

function run(generator) {
  const iterator = generator();
  function process(result) {
    if (result.done) {
      return;
    } else {
      result.value.then((data) => {
        process(iterator.next(data));
      });
    }
  }
  process(iterator.next());
}
run(asyncGenerator);
