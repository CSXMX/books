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
  constructor(maxConsumers) {
    this.maxConsumers = maxConsumers; // 最大并发执行任务的数量
    this.taskQueue = []; // 任务队列
    this.consumerQueue = []; // 消费队列
    this.count = 0; // 当前正在执行的任务数量
  }

  add(task) {
    return new Promise((resolve, reject) => {
      // 将 resolve 和 reject 函数附加到任务上
      task.resolve = resolve;
      task.reject = reject;
      // 如果还有空闲的消费者，则立即开始执行任务
      if (this.count < this.maxConsumers) {
        this.start(task);
      } else {
        // 否则将任务添加到任务队列中等待
        this.taskQueue.push(task);
      }
    });
  }

  async start(task) {
    this.count++; // 增加当前执行中的任务数

    this.consumerQueue.push(task); // 添加任务到消费队列
    try {
      const result = await task(); // 执行任务
      task.resolve(result); // 解析结果
    } catch (error) {
      task.reject(error); // 拒绝并传递错误
    }

    this.consumerQueue = this.consumerQueue.filter(consumer => consumer !== task); // 从消费队列中移除已完成的任务
    this.count--; // 减少当前执行中的任务数

    // 如果任务队列中有等待的任务，则启动下一个任务
    if (this.taskQueue.length > 0) {
      this.start(this.taskQueue.shift());
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

