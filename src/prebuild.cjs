const Path = require('path');
const { exec } = require('child_process');

const SRC_ROOT = Path.join(__dirname, '..');  // root

// 打包后端代码的函数
function buildBackend() {
    const backendPath = Path.join(SRC_ROOT, 'backend');
    process.chdir(backendPath);  // 切换到后端代码目录
    
    const pyinstallerCommand = 'pyinstaller -y --distpath=..\\build\\backend --add-data "uvicorn_log.ini;." main.py';
    // const pyinstallerCommand = 'pyinstaller -y --console --distpath=..\\build\\backend --add-data "uvicorn_log.ini;." main.py';
    
    return new Promise((resolve, reject) => {
        exec(pyinstallerCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('exec error: ' + error);
                return reject(error);
            }
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            resolve();
        });
    });
}

// 主函数
async function build() {
    try {
        // 调用打包后端代码函数
        await buildBackend();
        
        // 后端代码打包成功后，输出信息
        console.log('Backend successfully transpiled! (ready to be built with electron-builder)');
        
        // 在这里添加 electron-builder 打包逻辑，例如：
        // const execSync = require('child_process').execSync;
        // execSync('electron-builder');
    } catch (error) {
        console.error('Error occurred during backend build or electron-builder process');
    }
}

// 调用主函数进行打包
build();
