let event = require('iEvent');

cc.Class({
	extends: cc.Component,

	show: function (param) {
		this.node.active = true;
		this.bindEvents();
		this.onShow(param);
	},

	hide: function () {
		this.node.active = false;
		this.onHide();

		event.releaseNode(this);
	},

	/**
	 * 进入函数 (待重写)
	 * @Author   Zjw
	 * @DateTime 2018-04-12
	 * @param    {object}
	 * @return   {void}
	 */
	onShow: function (param) {
		// todo ...
	},

	/**
	 * 隐藏函数 (待重写)
	 * @Author   Zjw
	 * @DateTime 2018-04-12
	 * @return   {void}
	 */
	onHide: function () {
		// todo ...
	},

	/**
	 * 绑定事件 (待重写)
	 * @Author   Zjw
	 * @DateTime 2018-05-07
	 * @return   {void}
	 */
	bindEvents: function() {
		// todo ...
	},
});