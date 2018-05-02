cc.Class({
    extends: cc.Component,

    onLoad: function() {
    	let canvas = this.node.getComponent(cc.Canvas);

    	if (util.isEmpty(canvas)) {
    		util.log_sys('%-#f00', '未能找到cc.Canvas组件.');
    		return;
    	}
        
        let cw = cc.sys.isBrowser ? document.body.clientWidth : cc.winSize.width;
        let ch = cc.sys.isBrowser ? document.body.clientHeight : cc.winSize.height;
        let dw = ideal.config.designWidth;
        let dh = ideal.config.designHeight;

        let i = 1 + (cw / ch - dw / dh);
        let k = 1 + (dw / dh - cw / ch);

        if (i > 1) {
            canvas.fitWidth = false;
            canvas.fitHeight = true;
        } else {
            canvas.fitWidth = true;
            canvas.fitHeight = false;
        }
    },
});
