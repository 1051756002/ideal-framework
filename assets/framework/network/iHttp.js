let http = {};
let service = require('iService');

http.send = function(option, data) {
	if (!ideal._pcfg.enableAction || !ideal._pcfg.enableService) {
		iUtil.log_sys('%-'+ideal.color.Warn, '警告: 该项目没有启用 ServiceAction.');
		return;
	}

	// 请求配置Key
	var actionKey = iUtil.okey(ideal.action, option);

	if (iUtil.isEmpty(actionKey)) {
		let n;
		if (typeof option == 'object') {
			n = JSON.stringify(option);
		} else {
			n = option;
		}
		iUtil.log_sys('%-'+ideal.color.Warn, '警告: ServiceAction 中没有找到 "{0}" 指令.', n);
		return;
	}

	service.sendMsg(actionKey, option, data);
};

http.sendMsg = function(option, data) {
	// 请求配置Key
	var actionKey = iUtil.okey(ideal.action, option);

	// 合并默认配置
	option = iUtil.merge({
		path: ideal._pcfg.httpServer,
		timeout: 5000,
		method: 'GET',
	}, option);

	var path = option.path;
	var method = option.method.toLocaleUpperCase();

	path = iUtil.addUrlParam(path, 'action', option.action);

	// GET模式, 传参加入到Url中
	if (method == 'GET') {
		for (let i in data) {
			path = iUtil.addUrlParam(path, i, data[i]);
		};
	};

	var xhr = cc.loader.getXMLHttpRequest();
	xhr.timeout = option.timeout;
	xhr.open(method, path, true);

	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) {
			return;
		}

		// 请求成功
		if (xhr.status >= 200 && xhr.status < 300) {
			var resp = JSON.parse(xhr.responseText);

			service.parseMsg(actionKey, resp);

			// // 业务处理, 成功
			// if (parseInt(resp.ret) == 0) {
			// 	if (iUtil.isDefine(cfg.successFn)) {
			// 		cfg.successFn(resp.data);
			// 	}
			// }
			// // 业务处理, 失败
			// else {
			// 	if (iUtil.isDefine(cfg.failyFn)) {
			// 		cfg.failyFn(resp);
			// 	} else {
			// 		iUtil.tips(resp.desc);
			// 	}
			// }
		}
		// 请求失败
		else {
			iUtil.log_net('%-#f00', '请求失败!\nurl:{0}', cfg.path);
		}
	};

	if (option.method == 'GET') {
		if (cc.sys.isNative) {
			xhr.setRequestHeader('Accept-Encoding', 'gzip,deflate', 'text/html;charset=UTF-8');
		}
		xhr.send();
	}

	if (option.method == 'POST') {
		xhr.setRequestHeader('Content-Type', 'text/plain');
		xhr.send(JSON.stringify(data));
	}
};

module.exports = http;
