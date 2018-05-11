let _util = {};

/**
 * 重定位当前场景中的Page节点
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @return   {void}
 */
_util.fixedPage = function() {
    let nodes = cc.find('Canvas').children;
    for (let i in nodes) {
        if (nodes[i] instanceof cc.Node) {
            let node = nodes[i];
            let resp = node.name.match(/^(Page)([a-z|0-9]*)$/i);
            if (resp == null) continue;

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
            widget.isAlignOnce = !true;
        }
    }
};

/**
 * 显示消息提示
 * 支持以下几种传参顺序:
 * 1. content<消息内容>
 * 2. content<消息内容>, confirmFn<确认回调>
 * 3. content<消息内容>, confirmFn<确认回调>, cancelFn<取消回调>
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @return   {void}
 */
_util.tips = function () {
    let args = [];
    for (let i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    };

    if (args.length == 0) {
        return;
    }

    ideal.view.show('PopTips', './framework/prefab/', {
        content: args[0],
        confirmFn: args[1],
        cancelFn: args[2],
    });
};

/**
 * 显示Loading遮罩层
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @return   {void}
 */
_util.showLoading = function() {
    ideal.view.show('FixLoading', './framework/prefab/');
};

/**
 * 隐藏Loading遮罩层
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @return   {void}
 */
_util.hideLoading = function() {
    ideal.view.hide('FixLoading', './framework/prefab/');
};

/**
 * 显示软提示消息
 * 支持以下几种传参顺序:
 * 1. content<消息内容>
 * @Author   Zjw
 * @DateTime 2018-05-10
 * @return   {void}
 */
_util.msg = function() {
    let args = [];
    for (let i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    };

    if (args.length == 0) {
        return;
    }

    ideal.view.show('FixMsg', './framework/prefab/', {
        content: args[0],
    });
};

module.exports = _util;
