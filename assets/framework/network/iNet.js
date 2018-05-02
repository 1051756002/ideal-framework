let config = require('Config');
let Connector = require('iConnector');

let net = {};
let connList = {};

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
