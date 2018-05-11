cc.Class({
    extends: require('BasePage'),

    bindEvents: function() {
    	ideal.on('event.index', this.onEventIndex);

        this.node.on(cc.Node.EventType.TOUCH_END, function() {
            iUtil.log('执行了');
        }, this);
    },

    onEventIndex: function() {
        iUtil.log('event.index 触发!');
    },

    onTouchGo: function() {
        ideal.view.show('PageTest');
    },

    onTouchTips: function() {
        // iUtil.tips('ok');

        this.node.dispatchEvent(new cc.Event.EventCustom(cc.Node.EventType.TOUCH_END))
    },
});
