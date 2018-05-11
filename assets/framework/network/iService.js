/**
 * 业务服务器
 * 用于解析服务器推送过来的消息，分发出业务指令。
 */
let service = {};
let serviceList = window.serviceList = [];

if (ideal._pcfg.enableService) {
	let rn = 'Service';
	serviceList = require(rn);
};

// 初始化Service业务函数
service.init = function(fileName) {
	try {
		serviceList = require(fileName);
	}
	catch (err) {
		iUtil.log_sys('%-'+ideal.color.Warn, '警告: iService.init 没有找到指定文件.');
	}
};

// 发送指令
service.sendMsg = function(key, data) {
	let exist = false;

	let args = [];
	for (let i = 1; i < arguments.length; i++) {
		args.push(arguments[i]);
	};

	for (let i in serviceList) {
		if (typeof serviceList[i]['Send_' + key] == 'function') {
			serviceList[i]['Send_' + key].apply(serviceList[i], args);
			exist = true;
		}
	};

	if (!exist) {
		iUtil.log_sys('%-'+ideal.color.Warn, '警告: Service 中没有找到 "{0}" 指令的对应发送方法.', 'Send_' + key);
	}
};

// 解析消息
service.parseMsg = function(key, data) {
	let exist = false;

	let args = [];
	for (let i = 1; i < arguments.length; i++) {
		args.push(arguments[i]);
	};

	for (let i in serviceList) {
		if (typeof serviceList[i]['Recv_' + key] == 'function') {
			serviceList[i]['Recv_' + key].apply(serviceList[i], args);
			exist = true;
		}
	};

	if (!exist) {
		iUtil.log_sys('%-'+ideal.color.Warn, '警告: Service 中没有找到 "{0}" 指令的对应接收方法.', 'Recv_' + key);
	}
};

module.exports = service;
