let ViewMgr = {};

/**
 * 显示
 * @Author   Zjw
 * @DateTime 2018-04-12
 * 支持以下几种传参:
 * 1. nodeName<节点名称>, param<传参>
 * 2. nodeName<节点名称>, model<模块>, param<传参>
 * @return   {void}
 */
ViewMgr.show = function() {
    let args = [];
    for (let i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

    if (/Page.*/.test(args[0])) {
        this.page.show.apply(this.page, args);
    }
    else if (/Pop.*/.test(args[0])) {
        this.pop.show.apply(this.pop, args);
    }
    else if (/Fix.*/.test(args[0])) {
        this.fix.show.apply(this.fix, args);
    } else {
        iUtil.log_sys('%-#f00', '异常: "{0}" 命名格式错误.', args[0]);
    }
};

/**
 * 隐藏
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @return   {void}
 */
ViewMgr.hide = function(nodeName) {
    if (nodeName.slice(0, 3) == 'Pop') {
        this.pop.hide(nodeName);
    } else if (nodeName.slice(0,3) == 'Fix') {
        this.fix.hide(nodeName);
    } else {
        iUtil.log_sys('%-#f00', '异常: "{0}" 命名格式错误.', nodeName);
    }
};


/**
 * 弹窗类
 */
ViewMgr.pop = {
    /**
     * 显示Pop弹窗
     * @Author   Zjw
     * @DateTime 2018-05-09
     * @param    {String}                 popName 节点名称
     * @param    {String}                 model   模块名称, 也可以传入具体路径(不建议)
     * @param    {Object}                 param   传参
     * @return   {void}
     */
    show: function(popName, model, param) {
        let path, p = cc.find(popName);
        if (p != null) {
            p.getComponent('BasePop').show(param);
        } else {
            if (model.startsWith('./')) {
                path = iUtil.format('{0}/{1}', model, popName);
            } else {
                path = iUtil.format('./{0}/prefab/pop/{1}', model, popName);
            }
            cc.loader.loadRes(path, function(err, prefab) {
                if (err) {
                    iUtil.log_sys('%-' + ideal.color.Error, '异常: 没有找到 {0} 弹窗.', path);
                    return;
                }

                let node = cc.instantiate(prefab);
                cc.director.getScene().addChild(node);
                node.getComponent('BasePop').show(param);
            });
        }
    },

    /**
     * 隐藏Pop弹窗
     * @Author   Zjw
     * @DateTime 2018-05-09
     * @param    {String}                 popName 节点名称
     * @return   {void}
     */
    hide: function(popName) {
        let p = cc.find(popName);
        if (p != null) {
            p.getComponent('BasePop').hide();
        } else {
            iUtil.log_sys('%-#f00', '异常: 没有找到 "{0}" 弹窗.', popName);
        }
    },
};


/**
 * 常驻节点
 */
ViewMgr.fix = {
    /**
     * 显示常驻节点
     * @Author   Zjw
     * @DateTime 2018-05-09
     * @param    {String}                 fixName 节点名称
     * @param    {String}                 model   模块名称, 也可以传入具体路径(不建议)
     * @param    {Object}                 param   传参
     * @return   {void}
     */
    show: function(fixName, model, param) {
        let path, p = cc.find(fixName);
        if (p) {
            p.getComponent('BaseNode').show(param);
        } else {
            if (model.startsWith('./')) {
                path = iUtil.format('{0}/{1}', model, popName);
            } else {
                path = iUtil.format('./{0}/prefab/fix/{1}', model, popName);
            }
            cc.loader.loadRes(path, function(err, prefab) {
                if (err) {
                    iUtil.log_sys('%-' + ideal.color.Error, '异常: 没有找到 {0} 常驻.', path);
                    return;
                }

                let node = cc.instantiate(prefab);
                cc.director.getScene().addChild(node);
                node.getComponent('BaseFix').show(param);
            });
        }
    },

    /**
     * 隐藏常驻节点
     * @Author   Zjw
     * @DateTime 2018-05-09
     * @param    {String}                 fixName 节点名称
     * @return   {void}
     */
    hide: function(fixName) {
        var p = cc.find(fixName);
        if (p) {
            p.getComponent('BaseNode').hide();
        } else {
            iUtil.log_sys('%-#f00', '异常: 没有找到 "{0}" 常驻.', fixName);
        }
    }
};


/**
 * 页面类
 */
ViewMgr.page = {
    // 当前显示页
    ACTIVE_PAGE: null,

    /**
     * 本场景隐藏当前活动的页面
     * @return {void}
     */
    localHide: function() {
        if (this.ACTIVE_PAGE && this.ACTIVE_PAGE.isValid) {
            this.ACTIVE_PAGE.getComponent('BasePage').hide();
            this.ACTIVE_PAGE = null;
        }
    },

    /**
     * 本场景切换Page显示
     * @param  pageName  页面名
     * @param  param     跳转传参
     * @return {boolean} 是否在本场景中
     */
    localShow: function(pageName, param) {
        var p = cc.find('Canvas/' + pageName);
        if (p) {
            this.localHide(); //关闭当前打开的Page
            this.ACTIVE_PAGE = p;
            p.getComponent('BasePage').show(param);
        }
        return p;
    },

    /**
     * 通过页面名得到场景名
     * @param  pageName  页面名
     * @return {string}  场景名
     */
    getSceneName: function(pageName) {
        let config = require('Config');
        for (var i in config.scenes) {
            for (var j in config.scenes[i]) {
                if (config.scenes[i][j] == pageName) {
                    return i;
                }
            }
        }
    },

    /**
     * 切换新场景显示
     * @param  sceneName  场景名称
     * @return {void}
     */
    showScene: function(sceneName, pageName, param) {
        let STID_LOADSCENE = setTimeout(function() {
            iUtil.showLoading && iUtil.showLoading();
        }, 120);

        this.localHide();
        cc.director.loadScene(sceneName, function() {
            clearTimeout(STID_LOADSCENE);
            iUtil.fixedPage();
            iUtil.hideLoading && iUtil.hideLoading();
            this.localShow(pageName, param);
        }.bind(this));
    },

    /**
     * 显示指定页
     * @param  pageName  页面名
     * @param  param     参数
     */
    show: function(pageName, param) {
        if (!this.localShow(pageName, param)) {
            // 加载页面所在场景
            var sceneName = this.getSceneName(pageName);
            if (sceneName) {
                this.showScene(sceneName, pageName, param);
            } else {
                iUtil.log_sys('%-#f00', '异常: 没有找到 "{0}" 页面.', pageName);
            }
        }
    },
};


module.exports.show = ViewMgr.show.bind(ViewMgr);
module.exports.hide = ViewMgr.hide.bind(ViewMgr);
