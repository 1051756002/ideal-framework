let http = {};

http.send = function(cfg) {
	let xhr = cc.loader.getXMLHttpRequest();
	xhr.timeout = 5000;
	xhr.open(cfg.method, cfg.path, true);
	// 回掉处理
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4){
			return;
		}

		// 请求成功
		if (xhr.status >= 200 && xhr.status < 300) {
			var resp = JSON.parse(xhr.responseText);

			// 业务处理, 成功
			if (parseInt(resp.ret) == 0) {
				if (util.isDefine(cfg.successFn)) {
					cfg.successFn(resp.data);
				}
			}
			// 业务处理, 失败
			else {
				if (util.isDefine(cfg.failyFn)) {
					cfg.failyFn(resp);
				} else {
					util.tips(resp.desc);
				}
			}
		}
		// 请求失败
		else {
			util.log_net('%-#f00', '请求失败!\nurl:{0}', cfg.path);
		}
	};

	if (cfg.method == 'GET') {
		if (cc.sys.isNative) {
			xhr.setRequestHeader('Accept-Encoding', 'gzip,deflate', 'text/html;charset=UTF-8');
		}
		xhr.send();
	}

	if (cfg.method == 'POST') {
		xhr.setRequestHeader('Content-Type', 'text/plain');
		xhr.send(JSON.stringify(cfg.data));
	}
};

/**
 * 发送HTTP-GET请求
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {object}
 * @param    {function}
 * @param    {function}
 * @return   {void}
 */
http.get = function(data, successFn, failyFn) {
	let config = require('Config');
	let cfg = {
		path: config.httpServer,
		method: 'GET',
		data: {},
		successFn: successFn,
		failyFn: failyFn,
	};

	for (let i in data) {
		cfg.path = util.addUrlParam(cfg.path, i, data[i]);
	};

	http.send(cfg);
};

/**
 * 发送HTTP-POST请求
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {object}
 * @param    {function}
 * @param    {function}
 * @return   {void}
 */
http.post = function(data, successFn, failyFn) {
	let config = require('Config');
	let cfg = {
		path: config.httpServer,
		method: 'POST',
		data: data,
		successFn: successFn,
		failyFn: failyFn,
	};
	http.send(cfg);
};

module.exports = http;
