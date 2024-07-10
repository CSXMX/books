const nodeList = [
    {
        id: 1,
        children: [{
            id: 10,
            children: [
                { id: 1212 },
                { id: 323 }
            ]
        }, { id: 3 }]
    },
    {
        id: 7,
        children: [{ id: 6 }, { id: 2 }]
    },
    {
        id: 5,
        children: [{ id: 4 }]
    }
]
const output = [
    {
        id: 1,
        children: [{ id: 10 }, { id: 3 }]
    },
    {
        id: 7,
        children: [{ id: 6 }, { id: 2 }]
    },
]
function fn(input) {
    const depthFirstSearchIterative = (rootNode) => {
        let stack = [rootNode];
        let res = [];
        while (stack.length > 0) {
            const currentNode = stack.pop();
            if (input.includes(currentNode.id)) {
                return true;
            }
            res.push(currentNode.id); // 处理当前节点
            // 将子节点逆序推入栈中，以保证深度遍历
            if (currentNode.children) {
                for (let i = currentNode.children.length - 1; i >= 0; i--) {
                    stack.push(currentNode.children[i]);
                }
            }
        };
        return false;
    }
    let res = [];
    for (let i = 0; i < nodeList.length; i++) {
        if (depthFirstSearchIterative(nodeList[i])) {
            res.push(nodeList[i])
        }
    }
    return res;
}
console.log(fn([1212, 2]))