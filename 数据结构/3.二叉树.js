class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
// 二叉树的层次遍历
var levelOrder = function (root) {
  if (!root) {
    return [];
  }
  let queue = [root];
  let res = [];
  while (queue.length) {
    let len = queue.length;
    res.push([]);
    while (len--) {
      const node = queue.shift();
      res[res.length - 1].push(node.val);
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
  }
  return res;
};

// 根据层次遍历创建二叉树
function createTree(arr) {
  if (!arr.length) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  for (let i = 1; i < arr.length; i += 2) {
    const currentNode = queue.shift();
    if (arr[i] !== null) {
      currentNode.left = new TreeNode(arr[i]);
      queue.push(currentNode.left);
    }
    if (i + 1 < arr.length && arr[i + 1]) {
      currentNode.right = new TreeNode(arr[i + 1]);
      queue.push(currentNode.right);
    }
  }
  return root;
}
const tree = createTree([1, 2, 3, 4, 5]);
// console.log(tree, levelOrder(tree));

// 只根据先序遍历创建不了唯一的二叉树
function createBinaryTreeFromPreorder(preorder) {
  let index = 0; // 用于追踪字符序列的索引
  function buildTree() {
    if (index >= preorder.length) {
      index++; // 移动到下一个字符
      return null;
    }
    const root = new TreeNode(preorder[index]);
    index++; // 移动到下一个字符
    root.left = buildTree();
    root.right = buildTree();
    return root;
  }

  return buildTree();
}
// console.log(createBinaryTreeFromPreorder([1, 2, 3]));

// 先序遍历
const preOrder = (root, res) => {
  if (!root) return;
  res.push(root.val);
  preOrder(root.left, res);
  preOrder(root.right, res);
};
let result = [];
// 中序遍历
const inOrder = (root, res) => {
  if (!root) return;
  inOrder(root.left, res);
  res.push(root.val);
  inOrder(root.right, res);
};

// 后序遍历
const endOrder = (root, res) => {
  if (!root) return;
  endOrder(root.left, res);
  endOrder(root.right, res);
  res.push(root.val);
};

result = [];
preOrder(tree, result);
console.log("先序[递归]", result);

result = [];
inOrder(tree, result);
console.log("中序[递归]", result);

result = [];
endOrder(tree, result);
console.log("后序[递归]", result);

function preOrder2(root) {
  let res = [];
  let queue = [root];
  while (queue.length) {
    let node = queue.pop();
    res.push(node.val);
    if (node.right) {
      queue.push(node.right);
    }
    if (node.left) {
      queue.push(node.left);
    }
  }
  return res;
}
function inOrder2(root) {
  let stack = [];
  let res = [];
  while (root || stack.length) {
    while (root) {
      stack.push(root);
      root = root.left;
    }
    let node = stack.pop();
    res.push(node.val);
    root = node.right;
  }
  return res;
}
function endOrder2(root) {
  let res = [];
  let queue = [root];
  while (queue.length) {
    let node = queue.pop();
    res.push(node.val);
    if (node.left) {
      queue.push(node.left);
    }
    if (node.right) {
      queue.push(node.right);
    }
  }
  return res.reverse();
}
console.log("先序遍历【非递归版】", preOrder2(tree));
console.log("中序遍历【非递归版】", inOrder2(tree));
console.log("后序遍历【非递归版】", endOrder2(tree));
