function CodingMan(name) {
  this.name = name;
  this.tasks = [];

  const createTask = (seconds) => {
    const task = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`Wake up after ${seconds} seconds`);
          resolve();
        }, seconds * 1000);
      });
    };
    return task;
  };

  this.sleep = function (seconds) {
    this.tasks.push(createTask(seconds));
    return this;
  };

  this.sleepFirst = function (seconds) {
    this.tasks.unshift(createTask(seconds));
    return this;
  };

  this.eat = function (meal) {
    const task = () => {
      console.log(`Eat ${meal}`);
      return Promise.resolve();
    };
    this.tasks.push(task);
    return this;
  };

  this.next = async function () {
    if (this.tasks.length === 0) return;
    const fn = this.tasks.shift();
    await fn();
    this.next();
  };

  this.run = function () {
    const runTasks = async () => {
      for (const task of this.tasks) {
        await task();
      }
    };
    runTasks();
  };
  return this;
}

// 使用示例

const p = new CodingMan("Peter");
p.eat("a")
  .eat("b")
  .sleep(1)
  .eat("supper")
  .sleep(2)
  .eat("apple")
  .sleepFirst(1)
  .next();
