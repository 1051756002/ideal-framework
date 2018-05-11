let textureCache = {
	_cache: {},
};

textureCache.add = function(key, texture) {
	let source = this._cache[key];

	if (this._cache[key]) {
		iUtil.log_sys('%-#dcd72c', '纹理Key: "{0}" 已经存在, 未能加入缓存.', key);
		return false;
	}

	this._cache[key] = texture;
	return true;
};

textureCache.remove = function(key) {
	let source = this._cache[key];

	if (!this._cache[key]) {
		iUtil.log_sys('%-#dcd72c', '纹理Key: "{0}" 不存在缓存.', key);
		return false;
	}

	delete this._cache[key];
	return true;
};

textureCache.removeAll = function() {
	for (let i in this._cache) {
		this.remove(i);
	}
	return true;
};

textureCache.get = function(key) {
	return this._cache[key];
};

textureCache.exist = function(key) {
	return !!this._cache[key];
};

module.exports = textureCache;
