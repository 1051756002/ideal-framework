cc.Class({
    extends: require('BaseFix'),

    onLoad: function() {
        this._super();
        
    	let path = './framework/anims/loading';
        cc.loader.loadRes(path, function(err, clip) {
            if (err) {
                iUtil.log_sys('%-' + ideal.color.Warn, '警告: FixLoading 动画资源 {0} 读取失败.', path);
                return;
            }
            let animation = this.node.addComponent(cc.Animation);
            animation.addClip(clip);
        }.bind(this));
    },

    onShow: function() {
    	let animation = this.getComponent(cc.Animation);
    	animation && animation.play('loading');
    },

    onHide: function() {
    	let animation = this.getComponent(cc.Animation);
    	animation && animation.stop();
    },
});
