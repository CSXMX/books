class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(name, callback) {
    const res = this.events[name] || [];
    this.events[name] = res.concat(callback);
  }
  off(name, callback) {
    if (this.events[name]) {
      this.events[name] = this.events[name].filter((item) => item !== callback);
    }
  }
  emit(name, ...args) {
    if (this.events[name]) {
      this.events[name].forEach((fn) => {
        fn(...args);
      });
    }
  }
  once(name, callback) {
    const cb = (...args) => {
      callback(...args);
      this.off(name, cb);
    };
    this.on(name, cb);
  }
}
const eventEmitter = new EventEmitter();
eventEmitter.once("message", (p) => {
  console.log("once", p);
});
eventEmitter.emit("message", 2);
eventEmitter.emit("message", 3);
