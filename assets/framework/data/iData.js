let data = {
	cache: require('./iDataCache'),
};

data.init = function() {
	data.cache.read();
};

let source = require('./iDataSource');
Object.defineProperty(data, 'source', {
	get: function() {
		return source;
	},
	set: function(val) {
		source = val;
	},
});

module.exports = data;
