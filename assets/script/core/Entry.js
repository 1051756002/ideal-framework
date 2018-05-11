cc.Class({
	extends: require('BaseEntry'),

	properties: {
		tableView: require('iTableView'),
	},

	onShow: function() {
		ideal.view.show('PageIndex');
		// iUtil.log('初始化iTableView');
		// this.tableView.init(10, { val: 'data' });
	},
});