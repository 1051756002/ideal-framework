cc.Class({
    extends: require('BasePop'),

    properties: {
    	lblContent: cc.Label,
        btnCancel: cc.Button,
    },

    onShow: function(param) {
        if (iUtil.isEmpty(param)) {
            iUtil.log_sys('%-' + ideal.color.Warn, '警告: PopTips 需要传参.');
            return;
        }

    	var param = this.param = Object.assign({
    		content: '',
    	}, param);

        this.lblContent.string = param.content;

        this.btnCancel.node.active = iUtil.isDefine(param.cancelFn);
    },

    onTouchConfirm: function() {
    	let param = this.param;

    	if (iUtil.isDefine(param.confirmFn)) {
            let i = param.confirmFn();
            (i == undefined) && (i = true);
            (i == true) && this.hide();
    	} else {
    		this.hide();
    	}
    },

    onTouchCancel: function() {
    	let param = this.param;

    	if (iUtil.isDefine(param.cancelFn)) {
            let i = param.cancelFn();
            (i == undefined) && (i = true);
            (i == true) && this.hide();
    	} else {
    		this.hide();
    	}
    },
});
