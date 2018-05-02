let _util = {};

/**
 * 深拷贝
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {object}
 * @return   {object}
 */
_util.clone = function(obj) {
	if (obj === null || typeof obj !== 'object') {
		return;
	}

	var str, newobj = obj.constructor === Array ? [] : {};
	if (window.JSON) {
		str = JSON.stringify(obj), newobj = JSON.parse(str);
	} else {
		for (var i in obj) {
			newobj[i] = typeof obj[i] === 'object' ? util.clone(obj[i]) : obj[i];
		}
	}
	return newobj;
};

/**
 * 补零
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {number}
 * @param    {number}
 * @return   {string}
 */
_util.zeroize = function(val, num) {
	if (typeof num == 'undefined') {
		num = 2;
	}
	let str = '';
	for (let i = 0; i < num; i++) {
		str += '0';
	}
	str += val;
	return str.substring(str.length - num);
};

/**
 * 生成随机数
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {number}
 * @param    {number}
 * @return   {number}
 */
_util.rnd = function(min, max) {
	if (typeof max == 'undefined') {
		max = min;
		min = 0;
	}

	return Math.floor(Math.random() * max + min);
};

/**
 * MD5加密
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @return   {string}
 */
_util.md5 = function(content) {
	let md5 = require('../core/iMd5');

	if ( typeof md5 == 'function') {
		return md5(util.trim(content));
	} else {
		return content;
	}
};

/**
 * 获取对象的属性总数量
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {object}
 * @return   {number}
 */
_util.olen = function(obj) {
	if (Object['getOwnPropertyNames']) {
		return Object.getOwnPropertyNames(obj).length;
	}

	let len = 0;
	for (let i in obj) {
		len++;
	};
	return len;
};

/**
 * 合并对象
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {object}
 * @param    {object}
 * @return   {object}
 */
_util.merge = function(def, obj) {
	for (var k in def) {
		if (typeof obj[k] === 'undefined') {
			obj[k] = def[k];
		}
	}
	return obj;
};

module.exports = _util;
