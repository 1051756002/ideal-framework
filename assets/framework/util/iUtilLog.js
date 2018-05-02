let _util = {};

let log = function() {
	let args = [];
	for (let i = 0; i < arguments.length; i++) {
		args.push(arguments[i]);
	}

	// 文本
	if (typeof args[0] == 'string') {
		// 字体颜色过滤
		let result = args[0].toString().match(/^%-#([a-z|0-9]*)$/i);
		if (result != null && result.length == 2) {
			args.shift();
			if (typeof args[0] == 'string') {
				// 字体颜色仅支持Web端
				if (cc.sys.isBrowser) {
					let content = '%c' + util.format.apply(util, args);
					let clrcode = 'color:#' + result[1];
					args = [content, clrcode];
				} else {
					args = [util.format.apply(util, args)];
				}
			}
		} else {
			args = [util.format.apply(util, args)];
		}
	}

	console.log.apply(console, args);
};

let log2 = function() {

};

/**
 * 常用日志
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @return   {void}
 */
_util.log = function() {
	// 非调试模式
	if (!ideal.config.debug) {
		return;
	}

	if (ideal.config.debugLevel > 1) {
		return;
	}

	log.apply(this, arguments);
};

/**
 * 网络日志
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @return   {void}
 */
_util.log_net = function() {
	// 非调试模式
	if (!ideal.config.debug) {
		return;
	}

	if (ideal.config.debugLevel > 2) {
		return;
	}

	log.apply(this, arguments);
};

_util.logat = _util.log;

/**
 * 控制平台打印警告
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @return   {void}
 */
_util.warn = function() {
	if (!ideal.config.debug) {
		return;
	}
	let args = [];
	for (let i = 0; i < arguments.length; i++) {
		args.push(arguments[i]);
	}
	console.warn.apply(console, args);
};

/**
 * 系统日志
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @return   {void}
 */
_util.log_sys = function() {
	// 非调试模式
	if (!ideal.config.debug) {
		return;
	}

	log.apply(this, arguments);
};

/**
 * 清空控制台消息
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @return   {void}
 */
_util.clear = function() {
	console.clear();
};

module.exports = _util;
