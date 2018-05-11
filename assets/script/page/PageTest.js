cc.Class({
    extends: require('BasePage'),

    bindEvents: function() {
        ideal.on('event.ok', function() {
            iUtil.log('event.ok 触发!');
        }, this);
        ideal.on('event.no', function() {
            iUtil.log('event.no 触发!');
        }, this);
        ideal.on('event.ok', function() {
            iUtil.log('event.ok2 触发!');
        }, this);
    },

    onTouchGoIndex: function() {
        ideal.view.show('PageIndex');
    },

    onTouchGoNet: function() {
        ideal.view.show('PageNet');
    },
});
