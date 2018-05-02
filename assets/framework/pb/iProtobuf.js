let protobuf = {};
let protobufjs = require('./protobuf');

let loadNext = function(idx = 0, callback = null) {
	let plist = util.clone(ideal.config.protolist);
	if (idx >= plist.length) {
		util.isDefine(callback) && callback();
		return;
	}

	let fname = 'Unnamed';
	let path = plist[idx];
	let result = path.match(/\/([a-z|_|-]*)\.proto/i);
	if (util.isDefine(result)) {
		fname = result[1];
	};

	cc.loader.loadRes(path, function(err, res) {
		if (err) {
			util.log_sys(err);
			return;
		}

		let root = protobufjs.protoFromString(res);
		// field加入到protobuf中
		for (let i in root.ns.children) {
			let fieldName = root.ns.children[i].name;
			protobuf[fieldName] = root.build(fieldName);
		};

		util.log_sys('%-#999999', '- loaded file: {0}', path);
		util.log_sys('%-#999999', '  define as {0}', fname);
		loadNext(idx + 1, callback);
	});
};

protobuf.init = function(callback) {
	util.log_sys('%-#009999', 'protobuf loaded start.');
	loadNext(0, function() {
		util.log_sys('%-#009999', 'protobuf loaded complete.\n');
		util.isDefine(callback) && callback();
		delete protobuf.init;
	});
};

module.exports = protobuf;
