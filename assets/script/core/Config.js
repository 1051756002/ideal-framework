let config = {};

// 项目名
config.name = '';

// 是否启用Protobuf
config.enableProtobuf = false;
// 是否启用Service服务模块 (通常情况下不建议关闭, 请谨慎配置)
config.enableService = true;
// 是否启用TCP命令服务, 根据配置会在项目启动时定义全局变量
config.enableCmd = false;
// 是否启用HTTP命令服务, 根据配置会在项目启动时定义全局变量
config.enableAction = true;
// 是否启用开发者的Util模块
config.enableUtil = false;

// 游戏场景页面
config.scenes = {
	main: ['PageIndex', 'PageTest'],
	main2: ['PageNet'],
};

// HTTP请求地址
config.httpServer = '';
// TCP请求地址
config.tcpServer = 'ws://121.196.204.236:18001';
// 微信登录地址
config.wxLoginUrl = 'http://jifen.xingdong.co/xingdongwebpay/h5Game/new_getWeixinInfo.php';


// 不打印日志的接收命令
config.notlogRecv = [];

// 不打印日志的接收命令
config.notlogSend = [];

config.util = 'HUtil';

module.exports = config;
