let protobuf = {};
let protobufjs = require('./protobuf');

let loadNext = function(idx = 0, callback = null) {
	let plist = iUtil.clone(ideal.config.protolist);
	if (idx >= plist.length) {
		iUtil.isDefine(callback) && callback();
		return;
	}

	let fname = 'Unnamed';
	let path = plist[idx];
	let result = path.match(/\/([a-z|_|-]*)\.proto/i);
	if (iUtil.isDefine(result)) {
		fname = result[1];
	};

	cc.loader.loadRes(path, function(err, res) {
		if (err) {
			iUtil.log_sys(err);
			return;
		}

		let root = protobufjs.protoFromString(res);
		// field加入到protobuf中
		for (let i in root.ns.children) {
			let fieldName = root.ns.children[i].name;
			protobuf[fieldName] = root.build(fieldName);
		};

		iUtil.log_sys('%-#999999', '- loaded file: {0}', path);
		iUtil.log_sys('%-#999999', '  define as {0}', fname);
		loadNext(idx + 1, callback);
	});
};

protobuf.init = function(callback) {
	iUtil.log_sys('%-#009999', 'protobuf loaded start.');
	loadNext(0, function() {
		iUtil.log_sys('%-#009999', 'protobuf loaded complete.\n');
		iUtil.isDefine(callback) && callback();
		delete protobuf.init;
	});
};

module.exports = protobuf;
