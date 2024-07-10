self.onmessage = function (event) {
    let result = performComplexCalculation(event.data);
    self.postMessage(result);
}

function performComplexCalculation(data) {
    // 在这里执行你的复杂计算
    // 这只是一个示例，实际的计算可能会更复杂
    let result = 0;
    for (let i = 0; i < data; i++) {
        for (let j = 0; j < data; j++) {
            result += i * j;
        }
    }
    return result;
}