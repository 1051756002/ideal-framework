let SocketState = {
	Waiting: 0,			// 等待中
	Connecting: 1,		// 正在连接中
	Connected: 2,		// 已连接
	Disconnect: 3,		// 已断开
	Reconnecting: 4,	// 正在尝试重连
};

module.exports = SocketState;