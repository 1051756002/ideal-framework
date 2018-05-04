/**
 * 业务服务器
 * 用于解析服务器推送过来的消息，分发出业务指令。
 */
let service = {};
let serviceList = require('Service');

// 发送指令
service.sendMsg = function(cmd, data) {
	// 心跳包
	if (cmd == 'beat') {
		let conn = ideal.net.getConnector();
		conn.sendMsg({ cmd: 1 });
	}
	// 服务包
	else {
		let exist = false;
		let cmdKey = util.okey(CMD, cmd);

		for (let i in serviceList) {
			if (typeof serviceList[i]['Send_' + cmdKey] == 'function') {
				serviceList[i]['Send_' + cmdKey](data);
				exist = true;
			}
		};

		if (!exist) {
			util.log_sys('%-'+ideal.color.Warn, '警告: Service 中没有找到 "{0}" 指令的对应发送方法.', cmd);
		}
	}
};

// 解析消息
service.parseMsg = function(cmd, data) {
	// 心跳包
	if (cmd == 1) {
		ideal.net.emit('beat');
	} else {
		let exist = false;
		let cmdKey = util.okey(CMD, cmd);

		for (let i in serviceList) {
			if (typeof serviceList[i]['Recv_' + cmdKey] == 'function') {
				serviceList[i]['Recv_' + cmdKey](data);
				exist = true;
			}
		};

		if (!exist) {
			util.log_sys('%-'+ideal.color.Warn, '警告: Service 中没有找到 "{0}" 指令的对应接收方法.', cmd);
		}
	}
};

module.exports = service;

