cc.Class({
	extends: cc.Component,

	show: function (param) {
		this.node.active = true;
		this.onShow(param);
		this.refresh();
	},

	hide: function () {
		this.node.active = false;
		this.onHide();
	},

	refresh: function(param) {
		this.onRefresh(param);
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
	 * 刷新函数 (待重写)
	 * @Author   Zjw
	 * @DateTime 2018-04-12
	 * @return   {void}
	 */
	onRefresh: function() {
		// todo ...
	},
});