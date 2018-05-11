let config = require('Config');
let event = require('iEvent');
let service = require('iService');

let HeartBeat = require('iHeartBeat');
let SocketState = require('iSocketState');


let __proto = {};
let STID_LOADING = 0;

// 频繁请求管理池
let frequentPool = {};

let connector = function() {
	// 是否拦截连接异常时的Tips弹窗
	this.interceptTips = false;
	// 连接器名称, 对应iNet中的键
	this.name = '';
	// 已重连次数
	this.reconn = 0;
	// 重连次数上限
	this.reconnLimit = 5;
	// WebSocket对象
	this.socket = null;
	// 连接状态
	this.state = SocketState.Waiting;
};

/**
 * 异常处理
 * @Author   Zjw
 * @DateTime 2018-05-02
 * @param    {Object}                 err 异常对象
 * @return   {void}
 */
__proto.error = function(err) {
	iUtil.log_net('连接器: ' + this.name);
	iUtil.log_net(err);

	switch (err.type) {
		// 确认=重连
		case 2:
			iUtil.tips(err.msg, this.reconnect.bind(this));
			break;
		// 确认=重连, 取消=重启
		case 3:
			iUtil.tips(err.msg, this.reconnect.bind(this), function() {
				iUtil.log('重启');
			});
			break;
		// 确认=关闭弹窗
		default:
			iUtil.tips(err.msg);
			break;
	}
};

/**
 * 向服务器发送消息
 * @Author   Zjw
 * @DateTime 2018-04-24
 * @param    {String}                 cmd  指令名
 * @param    {Object}                 data 需要发送的数据对象
 * @return   {Boolean}                请求是否顺利进入Service层, 被拦截的情况下会返回false
 */
__proto.send = function(cmd, data = {}) {
	if (this.state != SocketState.Connected) {
		// this.error({
		// 	type: 2,
		// 	msg: '与服务器连接中断，请尝试重连！',
		// });
		let key = iUtil.okey(ideal.cmd, cmd) || cmd;
		iUtil.log_sys('%-'+ideal.color.Warn, '警告: {0} 请求发送失败, 连接器非连接状态.', key);
		return false;
	}

	if (!frequentPool[cmd]) {
		frequentPool[cmd] = Date.now();
	} else {
		// 限制时间, 0.2秒
		let limitTime = 200;
		let now = Date.now();
		// 相同请求发送过于频繁, 拦截
		if (now <= frequentPool[cmd] + limitTime) {
			let key = iUtil.okey(ideal.cmd, cmd) || cmd;
			iUtil.log_sys('%-'+ideal.color.Warn, '警告: {0} 请求发送过于频繁.', key);
			return false;
		}
		frequentPool[cmd] = now;
	}

	// 心跳包
	if (cmd == 'beat') {
		this.sendMsg({ cmd: 1 });
	} else {
		let key = iUtil.okey(ideal.cmd, cmd);

		if (key) {
			service.sendMsg(key, data);
		} else {
			iUtil.log_sys('%-'+ideal.color.Warn, '警告: iCmd 中没有找到 "{0}" 发送指令.', cmd);
		}
	}

	return true;
};

/**
 * 向服务器发送消息 (供Service层使用, 不建议在UI层直接调用此方法)
 * @Author   Zjw
 * @DateTime 2018-04-24
 * @param    {String}                 cmd  指令名
 * @param    {Object}                 data 需要发送的数据对象
 * @return   {void}
 */
__proto.sendMsg = function(data = {}) {
	if (this.state != SocketState.Connected) {
		this.error({
			type: 2,
			msg: '与服务器连接中断，请尝试重连！',
		});
		return;
	}

	if (config.notlog_send && config.notlog_send.indexOf(data.cmd) == -1) {
		iUtil.log_net('%-#0fe029', '发送: cmd={0}', data.cmd);
	}

	this.socket.send(JSON.stringify(data));
};

/**
 * 连接TCP服务器
 * @Author   Zjw
 * @DateTime 2018-04-24
 * @param    {String}                 url      服务器地址
 * @param    {Function}               callback 回调函数
 * @return   {void}
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
		callback && callback();

		// 通知网络连接成功事件
		ideal.emit(iEvent.NetConnected, {
			name: this.name,
			url: this.socket.url,
		});

		iUtil.log_net('%-#de590b', 'connect success.');
	}.bind(this);

	// 连接中断回调
	let closeFn = function(ev) {
		iUtil.log_net('%-#de590b', '网络中断.');
		this.error({
			type: 2,
			msg: '与服务器断开了，请尝试重连！'
		});
	}.bind(this);

	// 连接异常回调
	let errorFn = function(ev) {
		iUtil.log_net('%-#de590b', 'TCP网络错误: {0}', JSON.stringify(ev));
	}.bind(this);

	iUtil.log_net('%-#de590b', 'TCP服务器连接: {0}', serverUrl);
	this._openSocket(serverUrl, openFn, closeFn, errorFn);
};

/**
 * 重连TCP服务器
 * @Author   Zjw
 * @DateTime 2018-04-24
 * @return   {void}
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

	iUtil.log_net('第{0}/{1}次尝试重连...', this.reconn, this.reconnLimit);
	this.state = SocketState.Connecting;

	let url = this.socket.url;

	// 连接成功回调
	let openFn = function(ev) {
        this.reconn = 0;
		this.state = SocketState.Connected;

		// 通知网络重连成功事件
		ideal.emit(iEvent.NetReconnect, {
			name: this.name,
			url: this.socket.url,
		});

		iUtil.log_net('%-#de590b', '重连成功.');
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
		iUtil.log_net('%-#de590b', 'network error: {0}', JSON.stringify(ev));
	}.bind(this);

	this._openSocket(url, openFn, closeFn, errorFn);
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
	this._closeSocket(callback);
	return true;
};

/**
 * 与服务器断开且不弹窗
 * @Author   Zjw
 * @DateTime 2018-05-09
 * @return   {void}
 */
__proto.disconnect = function() {
	if (this.state != SocketState.Connected || this.socket.readyState != WebSocket.OPEN) {
		return false;
	}
	this.socket.onclose = function() {
		this.state = SocketState.Disconnect;

		// 停止心跳包
		this.heartbeat.stop();

		// 通知网络连接断开
		ideal.emit(iEvent.NetDisconnect, {
			name: this.name,
			url: this.socket.url,
		});

		clearTimeout(STID_LOADING), STID_LOADING = 0;
		iUtil.hideLoading && iUtil.hideLoading();
	}.bind(this);
	this._closeSocket();
	return true;
};

/**
 * 阻止网络中断弹窗提示
 * @Author   Zjw
 * @DateTime 2018-05-11
 * @return   {void}
 */
__proto.stopInterruptTips = function() {
	this.interceptTips = true;
};

/**
 * 恢复网络中断弹窗提示
 * @Author   Zjw
 * @DateTime 2018-05-11
 * @return   {void}
 */
__proto.resumeInterruptTips = function() {
	this.interceptTips = false;
};

/**
 * 开启WebSocket (此方法私有, 不建议外层调用)
 * @Author   Zjw
 * @DateTime 2018-05-09
 * @param    {String}                 serverUrl 需要连接的服务器地址
 * @param    {Function}               openFn    连接成功回调
 * @param    {Function}               closeFn   通讯断开回调
 * @param    {Function}               errorFn   通讯异常回调
 * @return   {void}
 */
__proto._openSocket = function(serverUrl, openFn, closeFn, errorFn) {
	try {
		let socket = this.socket = new WebSocket(serverUrl);

		socket.onopen = function(evt) {
			this.state = SocketState.Connected;

			// 启动心跳包
			this.heartbeat = new HeartBeat();
			this.heartbeat.start(this);

			openFn && openFn(evt);

			clearTimeout(STID_LOADING), STID_LOADING = 0;
			iUtil.hideLoading && iUtil.hideLoading();
		}.bind(this);

		socket.onmessage = function(evt) {
			this.receiveMsg(evt.data);
		}.bind(this);

		socket.onclose = function(evt) {
			this.state = SocketState.Waiting;

			// 停止心跳包
			this.heartbeat.stop();

			// 通知网络连接中断事件
			ideal.emit(iEvent.NetInterrupt, {
				name: this.name,
				url: this.socket.url,
			});

			if (!this.interceptTips) {
				closeFn && closeFn(evt);
			}

			clearTimeout(STID_LOADING), STID_LOADING = 0;
			iUtil.hideLoading && iUtil.hideLoading();
		}.bind(this);

		socket.onerror = function(evt) {
			errorFn && errorFn(evt);
		}.bind(this);

		// 恢复网络中断弹窗提示
		this.resumeInterruptTips();

		if (STID_LOADING == 0) {
			STID_LOADING = setTimeout(function() {
				iUtil.showLoading && iUtil.showLoading();
			}, 3000);
		}
	} catch (err) {
		this.error({ msg: err });
	}
};

/**
 * 关闭WebSocket (此方法私有, 不建议外层调用)
 * @Author   Zjw
 * @DateTime 2018-05-09
 * @param    {Function}               callback 关闭完成回调
 * @return   {void}
 */
__proto._closeSocket = function(callback) {
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
	let fn = function() {
		let resp = JSON.parse(buffer);

		if (config.notlog_recv && config.notlog_recv.indexOf(resp.cmd) == -1) {
			iUtil.log_net('%-#ea681c', '接收: cmd={0}', resp.cmd);
		}

		// 心跳包
		if (resp.cmd == 1) {
			ideal.emit('beat');
		} else {
			let key = iUtil.okey(ideal.cmd, resp.cmd);

			if (key) {
				service.parseMsg(key, resp);
			} else {
				iUtil.log_sys('%-'+ideal.color.Warn, '警告: iCmd 中没有找到 "{0}" 接收指令.', resp.cmd);
			}
		}
	};

	if (ideal.config.debug) {
		fn();
	} else {
		try {
			fn();
		} catch (err) {
			if (this.state != SocketState.Connecting) {
				this.error({ msg: err.message });
			} else {
				throw(err);
			}
		}
	}
};

connector.prototype = __proto;

module.exports = connector;
