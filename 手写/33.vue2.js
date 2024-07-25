let data = {
  name: "hdf",
  age: 19,
  friend: {
    name: "张纹龙",
  },
};

//变成响应式数据
observer(data);

function observer(target) {
  function defineReactive(target, key, value) {
    //深度观察
    observer(value);
    Object.defineProperty(target, key, {
      get() {
        return value;
      },
      set(newValue) {
        observer(newValue);
        if (newValue !== value) {
          console.log("更新视图", value, newValue);
          value = newValue;
        }
      },
    });
  }
  if (!target || typeof target !== "object") {
    return target;
  }
  for (let key in target) {
    defineReactive(target, key, target[key]);
  }
}
data.age = 18;
data.friend.name = 1;