let config = require('Config');
let event = require('iEvent');
let service = require('iService');

let HeartBeat = require('iHeartBeat');
let SocketState = require('iSocketState');


let __proto = {};
let STID_LOADING = 0;

let connector = function() {
	this.reconn = 0;
	this.reconnLimit = 5;
	this.socket = null;
	this.state = SocketState.Waiting;
};

/**
 * 异常处理
 * @Author   Zjw
 * @DateTime 2018-05-02
 * @param    {Object}                 err 异常对象
 * @return   {Void}
 */
__proto.error = function(err) {
	util.log_net(err);

	switch (err.type) {
		// 确认=重连
		case 2:
			util.tips(err.msg, this.reconnect.bind(this));
			break;
		// 确认=重连, 取消=重启
		case 3:
			util.tips(err.msg, this.reconnect.bind(this), function() {
				util.log('重启');
			});
			break;
		// 确认=关闭弹窗
		default:
			util.tips(err.msg);
			break;
	}
};

/**
 * 向服务器发送消息
 * @Author   Zjw
 * @DateTime 2018-04-24
 * @param    {String}                 cmd  指令名
 * @param    {Object}                 data 需要发送的数据对象
 * @return   {Void}
 */
__proto.send = function(cmd = '', data = {}) {
	if (this.state != SocketState.Connected) {
		this.error({
			type: 2,
			msg: '与服务器连接中断，请尝试重连！',
		});
		return;
	}
	service.sendMsg(cmd, data);
};

__proto.sendMsg = function(data = {}) {
	if (this.state != SocketState.Connected) {
		this.error({
			type: 2,
			msg: '与服务器连接中断，请尝试重连！',
		});
		return;
	}

	if (config.notlog_send && config.notlog_send.indexOf(data.cmd) == -1) {
		util.log_net('%-#0fe029', '发送: cmd={0}', data.cmd);
	}

	this.socket.send(JSON.stringify(data));
};

/**
 * 连接TCP服务器
 * @Author   Zjw
 * @DateTime 2018-04-24
 * @param    {String}                 url      服务器地址
 * @param    {Function}               callback 回调函数
 * @return   {Void}
 */
__proto.connect = function(serverUrl = null, callback) {
	// 只传入了回调函数
	if (arguments.length == 1 && typeof serverUrl == 'function') {
		callback = serverUrl;
		serverUrl = null;
	};

	// 默认取配置表中的地址
	if (serverUrl == null) {
		serverUrl = config.tcpServer;
	};

	// 阻止重复连接
	if (this.state != SocketState.Waiting) {
		callback && callback();
	};
	this.state = SocketState.Connecting;

	// 连接成功回调
	let openFn = function(ev) {
		this.reconn = 0;
		util.log_net('%-#de590b', 'connect success.');
		callback && callback();
	}.bind(this);

	// 连接中断回调
	let closeFn = function(ev) {
		util.log_net('%-#de590b', '网络中断.');
		this.error({
			type: 2,
			msg: '与服务器断开了，请尝试重连！'
		});
	}.bind(this);

	// 连接异常回调
	let errorFn = function(ev) {
		util.log_net('%-#de590b', 'TCP网络错误: {0}', JSON.stringify(ev));
	}.bind(this);

	util.log_net('%-#de590b', 'TCP服务器连接: {0}', serverUrl);
	this.openSocket(serverUrl, openFn, closeFn, errorFn);
};

/**
 * 重连TCP服务器
 * @Author   Zjw
 * @DateTime 2018-04-24
 * @return   {Void}
 */
__proto.reconnect = function() {
	if (this.socket == null) {
		this.connect();
		return;
	}

	this.reconn++;
	if (this.reconn > this.reconnLimit) {
		this.reconn = 0;
		this.error({
			type: 3,
			msg: '服务器重连失败，是否继续尝试？',
		});
		return;
	}

	util.log_net('第{0}/{1}次尝试重连...', this.reconn, this.reconnLimit);
	this.state = SocketState.Connecting;

	let url = this.socket.url;

	// 连接成功回调
	let openFn = function(ev) {
        this.reconn = 0;
		this.state = SocketState.Connected;
		util.log_net('%-#de590b', '重连成功.');
	}.bind(this);

	// 连接中断回调
	let closeFn = function(ev) {
		this.state = SocketState.Waiting;
		if (this.reconn == 0) {
			this.error({
				type: 2,
				msg: '与服务器断开了，请尝试重连！',
			});
		} else {
			this.reconnect();
		}
	}.bind(this);

	// 连接异常回调
	let errorFn = function(ev) {
		util.log_net('%-#de590b', 'network error: {0}', JSON.stringify(ev));
	}.bind(this);

	this.openSocket(url, openFn, closeFn, errorFn);
};

/**
 * 用于判定连接器是否连通状态
 * @Author   Zjw
 * @DateTime 2018-05-02
 * @return   {Boolean}
 */
__proto.connected = function() {
	return this.state == SocketState.Connected;
};

/**
 * 中断服务器
 * @Author   Zjw
 * @DateTime 2018-04-24
 * @param    {Function}               callback 回调函数
 * @return   {Boolean}
 */
__proto.interrupt = function(callback) {
	if (this.state != SocketState.Connected || this.socket.readyState != WebSocket.OPEN) {
		return false;
	}
	this.state = SocketState.Disconnect;
	this.closeSocket(callback);
	return true;
};

__proto.disconnect = function() {
	if (this.state != SocketState.Connected || this.socket.readyState != WebSocket.OPEN) {
		return false;
	}
	this.socket.onclose = function() {
		this.state = SocketState.Disconnect;
		this.heartbeat.stop();

		clearTimeout(STID_LOADING), STID_LOADING = 0;
		util.hideLoading && util.hideLoading();
	}.bind(this);
};

__proto.openSocket = function(serverUrl, openFn, closeFn, errorFn) {
	try {
		let socket = this.socket = new WebSocket(serverUrl);

		socket.onopen = function(evt) {
			this.state = SocketState.Connected;
			this.heartbeat = new HeartBeat();
			this.heartbeat.start(this);
			openFn && openFn(evt);

			clearTimeout(STID_LOADING), STID_LOADING = 0;
			ideal.util.hideLoading && ideal.util.hideLoading();
		}.bind(this);

		socket.onmessage = function(evt) {
			this.receiveMsg(evt.data);
		}.bind(this);

		socket.onclose = function(evt) {
			this.state = SocketState.Waiting;
			this.heartbeat.stop();
			closeFn && closeFn(evt);

			clearTimeout(STID_LOADING), STID_LOADING = 0;
			ideal.util.hideLoading && ideal.util.hideLoading();
		}.bind(this);

		socket.onerror = function(evt) {
			errorFn && errorFn(evt);
		}.bind(this);

		if (STID_LOADING == 0) {
			STID_LOADING = setTimeout(function() {
				ideal.util.showLoading && ideal.util.showLoading();
			}, 3000);
		}
	} catch (err) {
		this.error({ msg: '开启Socket失败，或许该浏览器不支持WebSocket' });
	}
};

__proto.closeSocket = function(callback) {
	let socket = this.socket;

	if (socket != null && socket.readyState != WebSocket.CLOSED) {
		if (callback) {
			let onClose = typeof socket.onclose == 'function' ? socket.onclose : null;
			socket.onclose = function() {
				onClose && onClose();
				callback();
			};
		}
		socket.close();
	} else {
		callback && callback();
	}
};

/**
 * 接收消息, 并做解析
 * @Author   Zjw
 * @DateTime 2018-04-24
 * @param    {string}                 buffer 接收到的消息内容
 * @return   {void}
 */
__proto.receiveMsg = function(buffer) {
	try {
		let data = JSON.parse(buffer);
		let cmd = data.cmd;

		// 错误消息
		// if (util.isDefine(data.err_disc)) {
		// 	this.error({ msg: data.err_disc });
		// 	return;
		// }

		let config = require('Config');
		if (config.notlog_recv && config.notlog_recv.indexOf(cmd) == -1) {
			util.log_net('%-#ea681c', '接收: cmd={0}', cmd);
		}

		// 解析指令
		service.parseMsg(cmd, data);
	} catch (err) {
		if (this.state != SocketState.Connecting) {
			this.error({ msg: err.message });
		} else {
			throw(err);
		}
	}
};

connector.prototype = __proto;

module.exports = connector;
