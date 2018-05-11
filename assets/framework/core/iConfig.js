let config = {};

// 是否为开发模式
config.debug = true;

// 调试等级, 决定日志输出
// 1: 系统日志, 通讯日志, 常用日志
// 2: 系统日志, 通讯日志
// 3: 系统日志
config.debugLevel = 1;

// 是否纯净化日志, 清除框架启动前的日志
config.pureLog = false;

// 是否启用缓存
config.enableCache = true;

// 客户端版本号
config.version = '0.1.0';

// 客户端设计尺寸
config.designWidth = 1136;
config.designHeight = 640;

// 微信分享标题
config.wxShareTitle = 'ideal-framework';
// 微信分享图标
config.wxShareIcon = 'http://gametest.xingdong.co/songyuan_h5/res/raw-assets/icon.b068d.png',

// 依赖内容
config.depend = {
	prefab: [ ['FixLoading', 0], ['PopTips', 1], ['FixMsg', 2] ],
	js: [ 'http://res.wx.qq.com/open/js/jweixin-1.1.0.js' ],
};

module.exports = config;
