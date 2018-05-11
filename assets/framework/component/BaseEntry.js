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
        this.initDependPrefab();
        // this.initSound();
    },

    initDependPrefab: function() {
        let prefabs = ideal.config.depend.prefab;

        if (prefabs.length > 0) {
            let loaded = 0;
            for (let i in prefabs) {
                let pname, pidx;
                if (prefabs[i] instanceof Array) {
                    pname = prefabs[i][0];
                    pidx = prefabs[i][1];
                } else {
                    pname = prefabs[i];
                    pidx = 0;
                }

                let path = './framework/prefab/' + pname;
                cc.loader.loadRes(path, function(err, prefab) {
                    if (err) {
                        iUtil.log_sys('%-' + ideal.color.Warn, '警告: BaseEntry {0} 读取失败.', path);
                        return;
                    }

                    loaded++;

                    let node = cc.instantiate(prefab);
                    cc.director.getScene().addChild(node, pidx);

                    if (loaded == prefabs.length) {
                        this.initPersist();
                    }
                }.bind(this));
            };
        } else {
            this.initPersist();
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
                    iUtil.log_sys('%-#009999', '常驻节点载入 {0}', node.name);
                }
            }
        }
        this.initAfter();
    },

    // 初始化音效文件
    initSound: function() {
        for (let i in this.sounds) {
            if (typeof this.sounds[i] != 'string') {
                continue;
            }

            let resp = this.sounds[i].match(/\/([a-z|0-9|_]*)\.mp3$/i);
            if (resp == null) {
                iUtil.log_sys('%-#f00', 'unidentified file types "{0}"', this.sounds[i]);
                continue;
            }

            ideal.sound.add(resp[1], this.sounds[i]);
        };
    },

    // 初始化Util文件
    initUtil: function() {
        if (ideal._pcfg.enableUtil == undefined) {
            iUtil.log_sys('%-' + ideal.color.Warn, '警告: Config.js 中没有配置 enableUtil 属性, 请及时增加配置. (本次赋予默认值true)');
            ideal._pcfg.enableUtil = true;
        }

        if (!ideal._pcfg.enableUtil) {
            return;
        }

        // 载入util模块
        let rn = 'Util', u_util = require(rn);
        if (u_util != null) {
            for (let i in u_util) {
                if (iUtil[i] == undefined) {
                    iUtil[i] = u_util[i];
                } else {
                    iUtil.log_sys('%-#999999', '警告: iUtil.{0} 已经存在, 未能加入到Util类中.', i);
                }
            };
        };
    },

    // 所有初始化之后执此行函数
    initAfter: function() {
        if (config == null) {
            throw '项目启动失败, 未能找到项目配置文件!';
        } else {
            this.onShow();
        }
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