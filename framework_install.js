var fs = require('fs');
var path = require('path');

var projectName = 'h5_test';
var projectPath = '../';
var frameworkPath = './assets/framework';

var confiTmp = `
let config = {};

// 项目名
config.name = '';

// 是否启用Protobuf
config.enableProtobuf = false;

// 游戏场景页面
config.scenes = {
};

// HTTP请求地址
config.httpServer = '';
// TCP请求地址
config.tcpServer = '';
// 微信登录地址
config.wxLoginUrl = 'http://jifen.xingdong.co/xingdongwebpay/h5Game/new_getWeixinInfo.php';


// 不打印日志的接收命令
config.notlogRecv = [];

// 不打印日志的接收命令
config.notlogSend = [];

module.exports = config;
`;

var utilTmp = `// 载入模块文件
module.exports = Object.assign.apply(Object, [
    {}
]);
`;

var serviceTmp = `// 载入模块文件
module.exports = [
];
`;

var serviceConfigTmp = `// CMD指令服务枚举
module.exports = {
};
`;

var projectTmp = `{
    "name": "platform-client",
    "engine": "cocos2d-html5",
    "packages": "packages"
}`;


// Parse arguments
var i = 2;
while (i < process.argv.length) {
    var arg = process.argv[i];

    switch (arg) {
        case '--name':
        case '-n':
            projectName = process.argv[i + 1];
            i += 2;
            break;
        case '--path':
        case '-p':
            projectPath = process.argv[i + 1];
            i += 2;
            break;
        default:
            i++;
            break;
    }
};

var copySync = function(dir) {
    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    };

    var subpaths = fs.readdirSync(dir);
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.' || subpaths[i].endsWith('.meta')) {
            continue;
        }
        // 暂时不加入pb模块
        if (subpaths[i].endsWith('pb')) {
            continue;
        }
        var subpath = path.join(dir, subpaths[i]);
        stat = fs.statSync(subpath);
        if (stat.isDirectory()) {
            mkdirSync(path.join(projectPath, subpath));
            copySync(subpath);
        } else if (stat.isFile()) {
        	copyFileSync(subpath, path.join(projectPath, subpath))
        }
    }
};

var copyFileSync = function(from, to) {
	fs.writeFileSync(to, fs.readFileSync(from));
};

var mkdirSync = function(path) {
	console.log('导入: ' + path);
    try {
        fs.mkdirSync(path);
    } catch (e) {
        if (e.code != 'EEXIST') throw e;
    }
};

// 项目地址拼接
projectPath = path.join(projectPath, projectName);

// 创建项目目录
mkdirSync(projectPath);
mkdirSync(path.join(projectPath, 'assets'));

// 框架模块
mkdirSync(path.join(projectPath, 'assets/framework'));
copySync(frameworkPath);

// 项目模块
mkdirSync(path.join(projectPath, 'assets/res'));
mkdirSync(path.join(projectPath, 'assets/resources'));
mkdirSync(path.join(projectPath, 'assets/scene'));
mkdirSync(path.join(projectPath, 'assets/script'));
mkdirSync(path.join(projectPath, 'assets/script/core'));
mkdirSync(path.join(projectPath, 'assets/script/fix'));
mkdirSync(path.join(projectPath, 'assets/script/page'));
mkdirSync(path.join(projectPath, 'assets/script/pop'));
mkdirSync(path.join(projectPath, 'assets/script/prefab'));
mkdirSync(path.join(projectPath, 'assets/script/service'));
mkdirSync(path.join(projectPath, 'assets/script/util'));

// 模板文件
fs.writeFileSync(path.join(projectPath, 'project.json'), projectTmp);
fs.writeFileSync(path.join(projectPath, 'assets/script/core/Config.js'), confiTmp);
fs.writeFileSync(path.join(projectPath, 'assets/script/util/Util.js'), utilTmp);
fs.writeFileSync(path.join(projectPath, 'assets/script/service/Service.js'), serviceTmp);
fs.writeFileSync(path.join(projectPath, 'assets/script/service/ServiceConfig.js'), serviceConfigTmp);


console.log('项目创建成功!');
