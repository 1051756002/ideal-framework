let ideal = window.ideal = {};

// 项目配置文件, 硬性规定
ideal._pcfg = require('Config');

/**
 * Ideal框架配置对象
 * @type {iConfig}
 */
ideal.config = require('iConfig');

/**
 * 字体颜色, 目前用于打日志时使用
 * @type {iFontColor}
 */
ideal.color = require('iFontColor');

/**
 * 公用方法管理类 (开辟全局作用域)
 * @type {iUtil}
 */
ideal.util = window.iUtil = require('iUtil');

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
 * 音效文件管理类
 * @type {iSound}
 */
ideal.sound = require('iSound');

/**
 * 纹理缓存管理类
 * @type {iTextureCache}
 */
ideal.textureCache = require('iTextureCache');




// ############# 网络模块 #############

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
 * 业务服务(TCP通讯)管理类
 * @type {iService}
 */
ideal.service = require('iService');




// ############# 事件管理模块 #############

let _event = require('iEvent');

/**
 * 触发事件
 * @Author   Zjw
 * @DateTime 2018-05-09
 * @param    {String|Array}             types 需要通知的事件, 支持多个事件同时通知
 * @param    {Object}                   data  传参
 * @return   {Boolean}
 */
ideal.emit = _event.emit;

/**
 * 监听事件
 * @Author   Zjw
 * @DateTime 2018-05-09
 * @param    {String|Array}             types    需要监听的事件，支持多个事件同时监听
 * @param    {Function}                 selector 监听的函数
 * @param    {Object}                   thisObj  This作用域
 * @return   {Boolean}
 */
ideal.on = _event.on;

/**
 * 移除监听事件
 * @Author   Zjw
 * @DateTime 2018-05-09
 * @param    {String|Array}             types    需要移除监听的事件, 支持多个事件同时移除
 * @param    {Function}                 selector 监听的函数
 * @return   {Boolean}
 */
ideal.off = _event.off;


/**
 * 事件类, 用于通知UI层事件 (开辟全局作用域)
 * @type {ServiceEvent}
 */
ideal.event = window.iEvent = ideal.util.merge({}, _event.NetEvents);




// ############# 开发者模块 #############

/**
 * 指令类, 用于TCP通讯 (开辟全局作用域)
 * @type {ServiceCmd}
 */
if (ideal._pcfg.enableService && ideal._pcfg.enableCmd) {
	let rn = 'ServiceCmd';
	let req = require(rn);
	if (typeof req == 'object') {
		ideal.cmd = window.iCmd = req;
	}
}

/**
 * 指令类, 用于HTTP通讯 (开辟全局作用域)
 * @type {ServiceAction}
 */
if (ideal._pcfg.enableService && ideal._pcfg.enableAction) {
	let rn = 'ServiceAction';
	let req = require(rn);
	if (typeof req == 'object') {
		ideal.action = window.iAction = req;
	}
}

/**
 * 事件类, 用于通知UI层事件 (开辟全局作用域)
 * @type {ServiceEvent}
 */
if (ideal._pcfg.enableService) {
	let rn = 'ServiceEvent';
	let req = require(rn);
	if (typeof req == 'object') {
		ideal.event = window.iEvent = ideal.util.merge(ideal.event, req);
	}
}




// ############# 开发者全局作用域 #############

/**
 * 子游戏全局作用域
 * @type {iGame}
 */
window.iGame = {};

/**
 * 大厅全局作用域
 * @type {iGame}
 */
window.iHall = {};




// ############# 框架启动模块 #############

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
		iUtil.isDefine(callback) && callback();
		return;
	}
	_initialize = true;

	// 纯净化控制平台日志
	if (ideal.config.pureLog) {
		iUtil.clear();
	};

	loadDependentScripts(function() {
		ideal.data.init();
		iUtil.log_sys('%-#0fe029', 'Version: {0}', ideal.config.version);
		iUtil.log_sys('%-#0fe029', 'DebugModel: {0}\n', ideal.config.debug);
		iUtil.log('%-#0fe029', 'ideal framework initialization end.');
		iUtil.isDefine(callback) && callback();
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
		iUtil.isDefine(callback) && callback();
		return;
	}
	let f = function(i = 0) {
		if (i >= ideal.config.depend.js.length) {
			iUtil.isDefine(callback) && callback();
		} else {
			iUtil.log_sys('%-#999999', '加载依赖脚本: {0}', ideal.config.depend.js[i]);
			iUtil.loadJavaScript(ideal.config.depend.js[i], function() {
				f(i + 1);
			});
		}
	}; f();
};

module.exports = ideal;
