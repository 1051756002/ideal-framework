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

module.exports = _util;
