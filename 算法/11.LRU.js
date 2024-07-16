class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.hashMap = new Map(); // 用于快速查找节点
    this.head = new Node(); // 头节点，实际不存储数据
    this.tail = new Node(); // 尾节点，实际不存储数据
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    if (this.hashMap.has(key)) {
      const node = this.hashMap.get(key);
      this.moveToHead(node); // 将访问的节点移动到头部
      return node.value;
    }
    return -1; // 如果key不存在，返回-1
  }

  put(key, value) {
    if (this.hashMap.has(key)) {
      // 如果key已存在，则更新其值并移到头部
      const node = this.hashMap.get(key);
      node.value = value;
      this.moveToHead(node);
    } else {
      const newNode = new Node(key, value);
      this.hashMap.set(key, newNode);
      this.addToHead(newNode);

      if (this.hashMap.size > this.capacity) {
        // 如果超过容量，删除尾部节点
        const tailNode = this.removeTail();
        this.hashMap.delete(tailNode.key);
      }
    }
  }

  moveToHead(node) {
    this.removeNode(node);
    this.addToHead(node);
  }

  addToHead(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  removeTail() {
    const tailNode = this.tail.prev;
    this.removeNode(tailNode);
    return tailNode;
  }
}

// 测试数据
const cache = new LRUCache(2);

cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1)); // 返回 1
cache.put(3, 3); // 逐出 key 2
console.log(cache.get(2)); // 返回 -1 (未找到)
cache.put(4, 4); // 逐出 key 1
console.log(cache.get(1)); // 返回 -1 (未找到)
console.log(cache.get(3)); // 返回 3
console.log(cache.get(4)); // 返回 4
