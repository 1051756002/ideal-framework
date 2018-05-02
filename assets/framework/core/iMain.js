let ideal = window.ideal = {};

/**
 * Ideal框架配置对象
 * @type {iConfig}
 */
ideal.config = require('iConfig')

/**
 * 公用方法管理类 (开辟全局作用域)
 * @type {iUtil}
 */
ideal.util = window.util = require('iUtil');

/**
 * 本地数据管理类
 * @type {iData}
 */
ideal.data = require('iData');

/**
 * 视图管理类
 * @type {iVewMgr}
 */
ideal.view = require('iViewMgr');

/**
 * Protobuf管理类
 * @type {iProtobuf}
 */
// ideal.pb = require('iProtobuf');

/**
 * TCP网络管理类
 * @type {iNet}
 */
ideal.net = require('iNet');

/**
 * HTTP请求管理类
 * @type {iHttp}
 */
ideal.http = require('iHttp');

/**
 * 音效文件管理类
 * @type {iSound}
 */
ideal.sound = require('iSound');

/**
 * 业务服务(TCP通讯)管理类
 * @type {iService}
 */
ideal.service = require('iService');

/**
 * 纹理缓存管理类
 * @type {iTextureCache}
 */
ideal.textureCache = require('iTextureCache');


// 禁止引擎日志输出
window.console.timeEnd = function() {};


let _initialize = false;
/**
 * 初始化架构
 * @Author   Zjw
 * @DateTime 2018-04-28
 * @param    {Function}               callback 执行完成后的调回函数, 如果框架已启动则直接回调
 * @return   {void}
 */
ideal.init = function(callback) {
	if (_initialize) {
		util.isDefine(callback) && callback();
		return;
	}
	_initialize = true;

	// 纯净化控制平台日志
	if (ideal.config.pureLog) {
		util.clear();
	};

	loadDependentScripts(function() {
		ideal.data.init();
		util.log_sys('%-#0fe029', 'Version: {0}', ideal.config.version);
		util.log_sys('%-#0fe029', 'DebugModel: {0}\n', ideal.config.debug);
		util.log('%-#0fe029', 'ideal framework initialization end.');
		util.isDefine(callback) && callback();
	});
};


/**
 * 用于判断框架是否已经启动
 * @type {Boolean}
 */
cc.js.getset(ideal, 'enable', function() {
	return _initialize;
});

/**
 * 加载依赖脚本列表
 * @Author   Zjw
 * @DateTime 2018-04-28
 * @param    {Function}               callback 执行完成后的回调函数
 * @return   {void}
 */
let loadDependentScripts = function(callback) {
	if (cc.sys.isNative) {
		util.isDefine(callback) && callback();
		return;
	}
	let f = function(i = 0) {
		if (i >= ideal.config.scriptlist.length) {
			util.isDefine(callback) && callback();
		} else {
			util.log_sys('%-#999999', '加载依赖脚本: {0}', ideal.config.scriptlist[i]);
			util.loadJavaScript(ideal.config.scriptlist[i], function() {
				f(i + 1);
			});
		}
	}; f();
};

module.exports = ideal;
