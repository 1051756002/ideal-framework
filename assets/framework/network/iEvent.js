/**
 * 事件管理
 * 用户注册/触发监听事件。
 */
var event = {};
var eventPools = {};

event.addEventListener = function(type, selector, thisObj) {
	if (!eventPools[type]) {
		eventPools[type] = [];
	};

	// 拦截重复注册事件
	for (let i in eventPools[type]) {
		if (eventPools[type][i].selector === selector) {
			return false;
		};
	};

	eventPools[type].push({
		selector: selector,
		thisObj: thisObj,
	});
	return true;
};

event.removeEventListener = function(type, selector) {
	if (!eventPools[type]) {
		return false;
	}

	for (let i = eventPools[type].length - 1; i > -1; i--) {
		if (selector) {
			if (eventPools[type][i].selector === selector) {
				eventPools[type].splice(i, 1);
			}
		} else {
			eventPools[type].splice(i, 1);
		}
	};

	if (eventPools[type].length == 0) {
		delete eventPools[type];
	}
	return true;
};

event.triggerEvent = function(type, data) {
	if (!eventPools[type]) {
		return false;
	}

	for (let i = 0; i < eventPools[type].length; i++) {
		let thisObj = eventPools[type][i].thisObj;
		let selector = eventPools[type][i].selector;

		if (thisObj) {
			selector.call(thisObj, data);
		} else {
			selector(data);
		}
	}
	return true;
};

event.releaseNode = function(node) {
	for (let t in eventPools) {
		for (let i = eventPools[t].length - 1; i > -1; i--) {
			if (eventPools[t][i].thisObj === node) {
				let fname = eventPools[t][i].selector.name || '匿名函数';
				iUtil.log('%-'+ideal.color.Slight, '释放: {0}', fname);
				eventPools[t].splice(i , 1);
			}
		}

		if (eventPools[t].length == 0) {
			delete eventPools[t];
		}
	}
};




// ############# 提供给外界使用 #############

/**
 * 触发事件
 * @Author   Zjw
 * @DateTime 2018-05-09
 * @param    {String|Array}             types 需要通知的事件, 支持多个事件同时通知
 * @param    {Object}                   data  传参
 * @return   {Boolean}
 */
event.emit = function(types, data) {
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
 * @DateTime 2018-05-09
 * @param    {String|Array}             types    需要监听的事件，支持多个事件同时监听
 * @param    {Function}                 selector 监听的函数
 * @param    {Object}                   thisObj  This作用域
 * @return   {Boolean}
 */
event.on = function(types, selector, thisObj) {
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
 * @DateTime 2018-05-09
 * @param    {String|Array}             types    需要移除监听的事件, 支持多个事件同时移除
 * @param    {Function}                 selector 监听的函数
 * @return   {Boolean}
 */
event.off = function(types, selector) {
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



// ############# 网络通讯事件 #############

event.NetEvents = {
	// 连接成功
	NetConnected: 'network.connected',
	// 网络重连
	NetReconnect: 'network.reconnect',
	// 连接断开
	NetDisconnect: 'network.disconnect',
	// 连接中断
	NetInterrupt: 'network.interrupt',
};

module.exports = event;