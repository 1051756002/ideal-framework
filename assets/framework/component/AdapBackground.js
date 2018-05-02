cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,
    },

    onLoad: function() {
        let cw = cc.sys.isBrowser ? document.body.clientWidth : cc.winSize.width;
        let ch = cc.sys.isBrowser ? document.body.clientHeight : cc.winSize.height;
        let dw = ideal.config.designWidth;
        let dh = ideal.config.designHeight;

        let i = 1 + (cw / ch - dw / dh);
        let k = 1 + (dw / dh - cw / ch);

        if (i > 1) {
            this.bg.width = dw * i;
            this.bg.height = dh * i;
        } else {
            this.bg.width = dw * k;
            this.bg.height = dh * k;
        }
    },
});
