let sound = {
	_sources: {},
};

sound.add = function(soundName, path) {
	let source = this._sources[soundName];

	if (iUtil.isDefine(source)) {
		iUtil.log_sys('%-#f00', 'the "{0}" sound effect file has already existed.', soundName);
		return false;
	}

	iUtil.log_sys('%-#009999', '音效文件载入 {0}: {1}', soundName, path);

	this._sources[soundName] = {
		path: path,
		id: -1,
	};
	return true;
};

sound.remove = function(soundName) {
	let source = this._sources[soundName];

	if (iUtil.isEmpty(source)) {
		iUtil.log_sys('%-#f00', 'the "{0}" sound effect file do not exist.', soundName);
		return false;
	}

	iUtil.log_sys('%-#79abab', '音效文件移除 {0}: {1}', soundName, source.path);
	cc.audioEngine.uncache(source.path);
	delete this._sources[soundName];
	return true;
};

sound.removeAll = function() {
	for (let i in this._sources) {
		this.remove(i);
	}
	return true;
};

sound.play = function(soundName, isLoop = false, volume = 1) {
	let source = this._sources[soundName];
	source.id = cc.audioEngine.play(source.path, isLoop, volume);
};

sound.playOnly = function(soundName, isLoop = false, volume = 1) {
	this.stop(soundName);

	let source = this._sources[soundName];
	source.id = cc.audioEngine.play(source.path, isLoop, volume);
};

sound.stop = function(soundName) {
	let source = this._sources[soundName];
	if (source.id > -1) {
		cc.audioEngine.stop(source.id);
		source.id = -1;
	}
};

module.exports = sound;
