/**
 * 业务服务器
 * 用于解析服务器推送过来的消息，分发出业务指令。
 */
let service = {};
let serviceList = [];

service.add = function(obj) {
	if (serviceList.indexOf(obj) == -1) {
		serviceList.push(obj);
	}
};

service.removeAll = function() {
	while (serviceList.length > 0) {
		serviceList.shift();
	};
};

// 发送指令
service.sendMsg = function(cmd, data) {
	let exist = false;

	// 心跳包
	if (cmd == 'beat') {
		let conn = ideal.net.getConnector();
		conn.sendMsg({ cmd: 1 });
	}
	// 服务包
	else {
		for (let i = 0; i < serviceList.length; i++) {
			exist = serviceList[i].sendMsg(cmd, data);
			if (exist) { break; }
		};

		if (!exist) {
			util.warn('WARN: %s not sent.', cmd);
		}
	}
};

// 解析消息
service.parseMsg = function(cmd, data) {
	let exist = false;
	
	// 心跳包
	if (cmd == 1) {
		ideal.net.emit('beat');
	} else {
		for (let i = 0; i < serviceList.length; i++) {
			exist = serviceList[i].parseMsg(cmd, data);
			if (exist) { break; }
		};

		if (!exist) {
			util.warn('WARN: { cmd: %d } not parsing.', cmd);
		}
	}
};

module.exports = service;

