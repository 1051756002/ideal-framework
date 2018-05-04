let config = require('Config');
let event = require('iEvent');
let Connector = require('iConnector');

let net = {};
let connList = {};

/**
 * 触发事件
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @param    {object}
 * @return   {void}
 */
net.emit = function(types, data) {
	if (!types) {
		return false;
	}

	let type_arr = [];
	if (typeof types == 'number') {
		types = types.toString();
	}
	if (typeof types == 'string') {
		type_arr = types.split(',');
	} else {
		type_arr = types.slice();
	}

	if (type_arr.length == 0) {
		return false;
	}

	type_arr.forEach(function(type) {
		event.triggerEvent(type, data);
	}, this);
	return true;
};

/**
 * 监听事件
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @param    {function}
 * @param    {object}
 * @return   {boolean}
 */
net.on = function(types, selector, thisObj) {
	if (!types) {
		return false;
	}

	let type_arr = [];
	if (typeof types == 'number') {
		types = types.toString();
	}
	if (typeof types == 'string') {
		type_arr = types.split(',');
	} else {
		type_arr = types.slice();
	}

	if (type_arr.length == 0) {
		return false;
	}

	type_arr.forEach(function(type) {
		event.addEventListener(type, selector, thisObj);
	}, this);
	return true;
};

/**
 * 移除监听事件
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @param    {function}
 * @return   {boolean}
 */
net.off = function(types, selector) {
	if (!types) {
		return false;
	}

	let type_arr = [];
	if (typeof types == 'number') {
		types = types.toString();
	}
	if (typeof types == 'string') {
		type_arr = types.split(',');
	} else {
		type_arr = types.slice();
	}

	if (type_arr.length == 0) {
		return false;
	}

	type_arr.forEach(function(type) {
		event.removeEventListener(type, selector);
	}, this);
	return true;
};

net.create = function(netName = 'mask', serverUrl = null, callback) {
	// 传参支持 (callback)
	if (arguments.length == 1) {
		if (typeof netName == 'function') {
			callback = netName;
			netName = 'mask';
			serverUrl = null;
		}
	}

	// 传参支持 (netName, callback)
	if (arguments.length == 2) {
		if (typeof serverUrl == 'function') {
			callback = serverUrl;
			serverUrl = null;
		}
	}

	// 默认取配置表中的地址
	if (serverUrl == null) {
		serverUrl = config.tcpServer;
	}

	if (connList[netName]) {
		util.log_sys('%-#999999', '警告: TCP连接器 "{0}" 已经存在, 创建失败!', netName);
		return;
	}

	let conn = new Connector();
	conn.connect(serverUrl, callback);
	connList[netName] = conn;
	return conn;
};

net.getConnector = function(netName = 'mask') {
	return connList[netName];
};

module.exports = net;
