const { fork } = require('child_process');
const path = require('path');

const startChildProcess = () => {
    const forkPath = path.resolve(__dirname, './fork/fork_compute.js');
    const compute = fork(forkPath, ['true'], {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    });
    /**
     * stdio: ['pipe', 'pipe', 'pipe', 'ipc']:
stdio配置了子进程的标准输入、标准输出、标准错误以及IPC通道的设置。
'pipe'表示将这些流管道化，使得父进程和子进程能够读写这些流。
'ipc'是Inter-Process Communication的缩写，用于在父进程和子进程之间发送消息。
     */
    compute.send('开启一个新的子进程');
    // 当一个子进程使用 process.send() 发送消息时会触发 'message' 事件
    compute.on('message', sum => {
        console.log('sum', sum)
    });
    compute.on('close', (code, signal) => {
        console.log(`收到close事件，子进程收到信号 ${signal} 而终止，退出码 ${code}`);
        compute.kill();
    })
    compute.on('error', (code) => {
        console.log('code', code);
        startChildProcess();
    })
    compute.stdout.on('data', (data) => {
        // 将Buffer转换为UTF-8编码的字符串
        const log = data.toString('utf8');
        console.log('子进程 stdout:', log);
    });
    compute.stderr.on('data', (data) => {
        // 将Buffer转换为UTF-8编码的字符串
        const errorLog = data.toString('utf8');
        console.error('子进程 stderr:', errorLog);
        startChildProcess();
    });
}
startChildProcess();






