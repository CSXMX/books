const dom = {
  val: 1,
  children: [
    {
      val: 2,
      children: [
        {
          val: 3,
          children: [],
        },
      ],
    },
    {
      val: 4,
      children: [],
    },
  ],
};

// dfs: 深度优先
function depthFirstSearch(node) {
  if (node) {
    console.log(node); // 处理当前节点
    for (let i = 0; i < node.children.length; i++) {
      depthFirstSearch(node.children[i]); // 递归处理子节点
    }
  }
}
// dfs: 深度优先，非递归版
function depthFirstSearchIterative(rootNode) {
  const stack = [rootNode];
  while (stack.length > 0) {
    const currentNode = stack.pop();
    console.log(currentNode); // 处理当前节点

    // 将子节点逆序推入栈中，以保证深度遍历
    for (let i = currentNode.children.length - 1; i >= 0; i--) {
      stack.push(currentNode.children[i]);
    }
  }
}

// bfs：广度优先
function breadthFirstSearch(node) {
  const queue = [node];

  while (queue.length > 0) {
    const currentNode = queue.shift();
    console.log(currentNode); // 处理当前节点

    for (let i = 0; i < currentNode.children.length; i++) {
      queue.push(currentNode.children[i]); // 将子节点添加到队列
    }
  }
}

// 调用广度遍历，从根节点开始
const rootNode = document.documentElement;
breadthFirstSearch(rootNode);
