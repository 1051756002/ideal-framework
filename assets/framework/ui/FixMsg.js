cc.Class({
    extends: require('BaseFix'),

    properties: {
        lblContent: cc.Label,
    },

    onLoad: function() {
        this._super();
        
    	let path = './framework/anims/msg';
        cc.loader.loadRes(path, function(err, clip) {
            if (err) {
                iUtil.log_sys('%-' + ideal.color.Warn, '警告: FixMsg 动画资源 {0} 读取失败.', path);
                return;
            }
            let animation = this.node.addComponent(cc.Animation);
            animation.addClip(clip);
        }.bind(this));
    },

    onShow: function(param) {
        if (iUtil.isEmpty(param)) {
            iUtil.log_sys('%-' + ideal.color.Warn, '警告: FixMsg 需要传参.');
            return;
        }
        
    	let animation = this.getComponent(cc.Animation);

        if (animation) {
            animation.play('msg');
            this.lblContent.string = param.content;
        }
    },

    onHide: function() {
    	let animation = this.getComponent(cc.Animation);
    	animation && animation.stop();
    },
});
