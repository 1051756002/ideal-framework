let ViewMgr = {};

/**
 * 显示
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @param    {object}
 * @return   {void}
 */
ViewMgr.show = function(nodeName, param) {
    if (nodeName.slice(0, 4) == 'Page') {
        this.page.show(nodeName, param);
    } else if (nodeName.slice(0, 3) == 'Pop') {
        this.pop.show(nodeName, param);
    } else if (nodeName.slice(0,3) == 'Fix') {
        this.fix.show(nodeName, param);
    } else {
        util.log_sys('%-#f00', '异常: "{0}" 命名格式错误.', nodeName);
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
        util.log_sys('%-#f00', '异常: "{0}" 命名格式错误.', nodeName);
    }
};

/**
 * 弹窗类
 */
ViewMgr.pop = {
    show: function(popName, param) {
        let p = cc.find(popName);
        if (p != null) {
            p.getComponent('BasePop').show(param);
        } else {
            util.log_sys('%-#f00', '异常: 没有找到 "{0}" 弹窗.', popName);
        }
    },

    hide: function(popName) {
        let p = cc.find(popName);
        if (p != null) {
            p.getComponent('BasePop').hide();
        } else {
            util.log_sys('%-#f00', '异常: 没有找到 "{0}" 弹窗.', popName);
        }
    },
};


/**
 * 常驻节点
 */
ViewMgr.fix = {
    // 得到常驻节点
    getFixed: function(fixName) {
        for (var i in cc.game._persistRootNodes) {
            if (fixName == cc.game._persistRootNodes[i]._name) {
                return cc.game._persistRootNodes[i];
            }
        }
        util.log_sys('%-#f00', '异常: 没有找到 "{0}" 常驻.', fixName);
    },

    // 显示一个常驻节点
    show: function(fixName, param) {
        var p = this.getFixed(fixName);
        if (p) {
            p.getComponent('BaseNode').show(param);
        } else {
            util.log_sys('%-#f00', '异常: 没有找到 "{0}" 常驻.', fixName);
        }
    },

    // 隐藏一个常驻节点
    hide: function(fixName) {
        var p = this.getFixed(fixName);
        if (p) {
            p.getComponent('BaseNode').hide();
        } else {
            util.log_sys('%-#f00', '异常: 没有找到 "{0}" 常驻.', fixName);
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
            util.showLoading && util.showLoading();
        }, 120);

        cc.director.loadScene(sceneName, function() {
            clearTimeout(STID_LOADSCENE);
            util.fixedPage();
            util.hideLoading && util.hideLoading();
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
                util.log_sys('%-#f00', '异常: 没有找到 "{0}" 页面.', pageName);
            }
        }
    },

    // 刷新页面
    refresh: function(pageName, param) {
        var p = (pageName == null ? this.ACTIVE_PAGE : cc.find('Canvas/' + pageName));
        if (p) {
            p.getComponent('BaseNode').refresh(param);
        }
        return p;
    }
};

module.exports.show = ViewMgr.show.bind(ViewMgr);
module.exports.hide = ViewMgr.hide.bind(ViewMgr);
