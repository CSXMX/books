async function fetch(url) {
  return new Promise((resolve, reject) => {
    const res = {
      json: () => ({ url }),
    };
    setTimeout(() => {
      resolve(res);
    }, 1000);
  });
}
class Scheduler {
  constructor(max) {
    this.count = 0;
    this.max = max || 2;
    this.tasks = [];
  }
  add(task) {
    return new Promise((resolve, reject) => {
      task.resolve = resolve;
      task.reject = reject;
      if (this.count < this.max) {
        this.start(task);
      } else {
        this.tasks.push(task);
      }
    });
  }
  async start(task) {
    this.count++;
    try {
      const result = await task(); // 修正：直接 await task，因为它是一个异步函数
      task.resolve(result); // 将解析后的结果传递给 resolve 函数
    } catch (error) {
      task.reject(error);
    }
    this.count--;
    if (this.tasks.length > 0) {
      this.start(this.tasks.shift());
    }
  }
}
const requestList = async (urlList, limit = 2) => {
  let scheduler = new Scheduler(limit);
  try {
    const list = await Promise.all(
      urlList.map((url) => {
        return scheduler.add(async () => {
          const fetchRes = await fetch(url);
          console.log("fetch", fetchRes.json());
        });
      })
    );
    return list;
  } catch (err) {
    console.log("err", err);
  }
};

let urlList = new Array(50).fill(0).map((val, inx) => inx);
requestList(urlList, 5);

