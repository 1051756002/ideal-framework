cc.Class({
    extends: require('BaseNode'),

    properties: {
        enableMask: {
            default: true,
            displayName: '启用遮罩层',
            tooltip: '决定是否启用遮罩层',
        },

        enableAnim: {
            default: true,
            displayName: '启用过渡效果',
            tooltip: '决定是否启用过渡效果',
        },

        layMask: {
            visible: false,
            default: null,
            type: cc.Node,
            tooltip: '遮罩层节点',
        },
    },

    onLoad: function() {
        // 创建遮罩层
        if (this.enableMask == true) {
            var maskNode = new cc.Node('lay_mask');
            maskNode.parent = this.node;
            maskNode.zIndex = -1;
            maskNode.opacity = 255 / 2;
            maskNode.color = cc.color(0, 0, 0);
            this.layMask = maskNode;

            let maskWidget = maskNode.addComponent(cc.Widget);
            maskWidget.left = 0;
            maskWidget.isAlignLeft = true;
            maskWidget.right = 0;
            maskWidget.isAlignRight = true;
            maskWidget.top = 0;
            maskWidget.isAlignTop = true;
            maskWidget.bottom = 0;
            maskWidget.isAlignBottom = true;
            maskWidget.isAlignOnce = false;

            maskNode.addComponent(cc.BlockInputEvents);

            cc.loader.loadRes('./framework/imgs/single_color', cc.Texture2D, function(err, texture) {
                if (err) {
                    iUtil.log_sys('%-' + ideal.color.Warn, '警告: BasePop 遮罩层读取单色资源失败, 但不影响点击事件拦截.');
                    return;
                }
                // 避免警告 unknown asset type CC_SpriteFrame
                this.scheduleOnce(function() {
                    let maskSprite = maskNode.addComponent(cc.Sprite);
                    maskSprite.spriteFrame = new cc.SpriteFrame(texture);
                }, 0.2);
            }.bind(this));
        };

        // 重定位到屏幕显示区域
        let widget = this.node.getComponent(cc.Widget);
        if (!widget) {
            widget = this.node.addComponent(cc.Widget);
        }
        widget.left = 0;
        widget.isAlignLeft = true;
        widget.right = 0;
        widget.isAlignRight = true;
        widget.top = 0;
        widget.isAlignTop = true;
        widget.bottom = 0;
        widget.isAlignBottom = true;
        widget.isAlignOnce = false;

        // 强制隐藏
        this.node.active = false;
    },

    show: function(param) {
        if (this.enableAnim == true) {
            let animName = 'pop_show';
            let animation = this.node.getComponent(cc.Animation);

            this._param = param;
            if (animation) {
                let clip, clips = animation.getClips();
                for (let i in clips) {
                    if (clips[i].name == animName) {
                        clip = clips[i]; break;
                    }
                }
                if (clip) {
                    animation.play(animName);
                } else {
                    this.loadAnimationClipAndPlay(animation, animName);
                }
            } else {
                animation = this.node.addComponent(cc.Animation);
                this.loadAnimationClipAndPlay(animation, animName);
            }
        } else {
            this._super(param);
        }
    },

    hide: function() {
        if (this.enableAnim == true) {
            let animName = 'pop_hide';
            let animation = this.node.getComponent(cc.Animation);

            if (animation) {
                let clip, clips = animation.getClips();
                for (let i in clips) {
                    if (clips[i].name == animName) {
                        clip = clips[i]; break;
                    }
                }
                if (clip) {
                    animation.play(animName);
                } else {
                    this.loadAnimationClipAndPlay(animation, animName);
                }
            } else {
                animation = this.node.addComponent(cc.Animation);
                this.loadAnimationClipAndPlay(animation, animName);
            }
        } else {
            this._super();
        }
    },

    loadAnimationClipAndPlay: function(animation, clipName) {
        let path = './framework/anims/' + clipName;
        cc.loader.loadRes(path, function(err, clip) {
            if (err) {
                iUtil.log_sys('%-' + ideal.color.Warn, '警告: BasePop 动画资源 {0} 读取失败.', path);
                return;
            }
            animation.addClip(clip);
            animation.play(clipName);
        }.bind(this));
    },

    animationBefore: function() {
        let param = this._param;
        this.node.active = true;
        this.onShow(param);
        delete this._param;
    },

    animationAfter: function() {
        this.node.active = false;
        this.onHide();
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
