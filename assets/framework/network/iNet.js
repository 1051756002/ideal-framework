let config = require('Config');
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
	iUtil.log_sys('%-'+ideal.color.Warn, '警告: ideal.net.emit 即将废弃, 请及时改为 ideal.emit');
	return ideal.emit(types, data);
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
	iUtil.log_sys('%-'+ideal.color.Warn, '警告: ideal.net.on 即将废弃, 请及时改为 ideal.on');
	return ideal.on(types, selector, thisObj);
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
	iUtil.log_sys('%-'+ideal.color.Warn, '警告: ideal.net.off 即将废弃, 请及时改为 ideal.off');
	return ideal.off(types, selector);
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
		iUtil.log_sys('%-#999999', '警告: TCP连接器 "{0}" 已经存在, 创建失败!', netName);
		return;
	}

	let conn = new Connector();
	conn.name = netName;
	conn.connect(serverUrl, callback);
	connList[netName] = conn;
	return conn;
};

net.getConnector = function(netName = 'mask') {
	return connList[netName];
};

/**
 * 断开所有TCP连接器
 * @Author   Zjw
 * @DateTime 2018-05-11
 * @return   {void}
 */
net.clean = function() {
	for (let i in connList) {
		connList[i].disconnect();
		// delete connList[i];
	}
};

module.exports = net;
