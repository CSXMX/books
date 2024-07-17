// 判断是否为对象 ，注意 null 也是对象
const isObject = (val) => val !== null && typeof val === "object";
// 判断key是否存在
const hasOwn = (target, key) =>
  Object.prototype.hasOwnProperty.call(target, key);

function reactive(target) {
  // 首先先判断是否为对象
  if (!isObject(target)) return target;

  const handler = {
    get(target, key, receiver) {
      console.log(`获取对象属性${key}值`);
      // 这里还需要收集依赖，先空着
      track(target, key);

      const result = Reflect.get(target, key, receiver);
      // 递归判断的关键, 如果发现子元素存在引用类型，递归处理。
      if (isObject(result)) {
        return reactive(result);
      }
      return result;
    },

    set(target, key, value, receiver) {
      console.log(`设置对象属性${key}值`);

      // 首先先获取旧值
      const oldValue = Reflect.get(target, key, reactive);

      // set 是需要返回 布尔值的
      let result = true;
      // 判断新值和旧值是否一样来决定是否更新setter
      if (oldValue !== value) {
        result = Reflect.set(target, key, value, receiver);
        trigger(target, key);
      }
      return result;
    },

    deleteProperty(target, key) {
      console.log(`删除对象属性${key}值`);

      // 先判断是否有key
      const hadKey = hasOwn(target, key);
      const result = Reflect.deleteProperty(target, key);

      if (hadKey && result) {
        // 删除时，是否需要 响应式触发trigger
        trigger(target, key);
      }

      return result;
    },
  };
  return new Proxy(target, handler);
}

// activeEffect 表示当前正在走的 effect
let activeEffect = {};
const effectStack = [];

function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    const res = fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return res;
  };
  effectFn.deps = [];
  effectFn.options = options;
  if (!options.lazy) {
    effectFn();
  }
  // computed
  return effectFn;
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

// targetMap 表里每个key都是一个普通对象 对应他们的 depsMap
let targetMap = new WeakMap();

function track(target, key) {
  if (!activeEffect) return;
  // 获取当前对象的依赖图
  let depsMap = targetMap.get(target);
  // 不存在就新建
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  // 根据key 从 依赖图 里获取到到 effect 集合
  let dep = depsMap.get(key);
  // 不存在就新建
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  // 如果当前effectc 不存在，才注册到 dep里
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}

// trigger 响应式触发
function trigger(target, key) {
  // 拿到 依赖图
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    // 没有被追踪，直接 return
    return;
  }
  // 拿到了 视图渲染effect 就可以进行排队更新 effect 了
  const dep = depsMap.get(key);
  // 遍历 dep 集合执行里面 effect 副作用方法
  // 避免 副作用的依赖数组 无限增删依赖问题
  const effectsToRun = new Set(dep);
  effectsToRun.forEach((effectFn) => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}

function computed(fn) {
  let dirty = true;
  let val;
  const effectFn = effect(fn, {
    lazy: true,
    scheduler(fn) {
      if (!dirty) {
        dirty = true;
        trigger(obj, "value");
      }
    },
  });
  const obj = {
    get value() {
      if (dirty) {
        val = effectFn();
        dirty = false;
        // console.log('重新计算',val);
      } else {
        // console.log('旧值',val);
      }
      track(obj, "value");
      return val;
    },
  };
  return obj;
}

// 遍历读取对象的每个值
function traverse(value, seen = new Set()) {
  if (value !== "object" || value === null || seen.has(value)) {
    return;
  }
  seen.add(value);
  for (const k in value) {
    traverse(value[k], seen);
  }
  return value;
}

function watch(source, cb, options = {}) {
  let getter;
  let newValue, oldValue;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = traverse(source);
  }
  const job = () => {
    newValue = effectFn();
    cb(oldValue, newValue);
    oldValue = newValue;
  };
  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: job,
  });
  if (options.immediate) {
    job();
  } else {
    oldValue = effectFn();
  }
}
