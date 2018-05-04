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