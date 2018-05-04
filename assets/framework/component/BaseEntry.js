let ideal = require('iMain');
let config = require('Config');

cc.Class({
    extends: require('AdapCanvas'),

    properties: {
        // sounds: [cc.AudioClip],
    },

    onLoad: function() {
        this._super();

        if (ideal.enable) {
            this.onInit();
        } else {
            ideal.init(this.onInit.bind(this));
        }
    },

    onInit: function() {
        this.initUtil();
        this.initPersist();
        // this.initSound();

        if (config == null) {
            throw '项目启动失败, 未能找到项目配置文件!';
        } else {
            this.onShow();
        }
    },

    // 初始化常驻节点
    initPersist: function() {
        let nodes = cc.director.getScene().children;
        for (let i in nodes) {
            if (nodes[i] instanceof cc.Node) {
                let node = nodes[i];
                let resp = node.name.match(/^(pop|fix)([a-z|0-9]*)$/i);
                if (resp == null) continue;

                // 载入常驻节点
                if (!cc.game.isPersistRootNode(node)) {
                    cc.game.addPersistRootNode(node);
                    util.log_sys('%-#009999', '常驻节点载入 {0}', node.name);

                    // 强制隐藏
                    node.active = false;

                    // 重定位到屏幕显示区域
                    let widget = node.getComponent(cc.Widget);
                    if (!widget) {
                        widget = node.addComponent(cc.Widget);
                    }

                    widget.left = 0;
                    widget.isAlignLeft = true;
                    widget.right = 0;
                    widget.isAlignRight = true;
                    widget.top = 0;
                    widget.isAlignTop = true;
                    widget.bottom = 0;
                    widget.isAlignBottom = true;
                    widget.isAlignOnce = true;
                }
            }
        }
    },

    // 初始化音效文件
    initSound: function() {
        for (let i in this.sounds) {
            if (typeof this.sounds[i] != 'string') {
                continue;
            }

            let resp = this.sounds[i].match(/\/([a-z|0-9|_]*)\.mp3$/i);
            if (resp == null) {
                util.log_sys('%-#f00', 'unidentified file types "{0}"', this.sounds[i]);
                continue;
            }

            ideal.sound.add(resp[1], this.sounds[i]);
        };
    },

    // 初始化Util文件
    initUtil: function() {
        // 载入util模块
        let u_util = require('Util');
        if (u_util != null) {
            for (let i in u_util) {
                if (util[i] == undefined) {
                    util[i] = u_util[i];
                } else {
                    util.log_sys('%-#999999', '警告: util.{0} 已经存在, 未能加入到Util类中.', i);
                }
            };
        };
    },

    /**
     * 进入函数 (待重写)
     * @Author   Zjw
     * @DateTime 2018-04-12
     * @param    {object}
     * @return   {void}
     */
    onShow: function(param) {
        // todo ...
    },
});
