let cache = {};
let config = require('Config');
let source = require('./iDataSource');

// 读取缓存
cache.read = function() {
	if (ideal.config.enableCache) {
		var localData = cc.sys.localStorage.getItem(config.name);
		try {
			var data = JSON.parse(localData);
		} catch (err) {
			throw 'ERROR: iDataCache "localData" is not JSON.';
			return;
		}
		for (let i in data) {
			source[i] = data[i];
		};
	}
};

// 保存缓存
cache.save = function() {
	if (ideal.config.enableCache) {
		cc.sys.localStorage.setItem(config.name, JSON.stringify(source));
	}
};

// 清除缓存
cache.clear = function() {
	if (ideal.config.enableCache) {
		cc.sys.localStorage.setItem(config.name, JSON.stringify({}));
	}
};

module.exports = cache;
