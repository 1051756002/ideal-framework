// 合并所有util函数
let util = Object.assign.apply(Object, [
	require('./iUtilLog'),
	require('./iUtilData'),
	require('./iUtilString'),
	require('./iUtilCommon'),
	require('./iUtilCookie'),
	require('./iUtilView')
]);

module.exports = util;
