cc.Class({
    extends: require('BasePage'),

    bindEvents: function() {
        ideal.on(iEvent.NetConnected, function(conn) {
            iUtil.log('网络连接成功');
            iUtil.log(conn);
        }, this);
        
        ideal.on(iEvent.NetReconnect, function(conn) {
            iUtil.log('网络重连成功');
            iUtil.log(conn);
        }, this);

        ideal.on(iEvent.NetDisconnect, function(conn) {
            iUtil.log('网络连接断开');
            iUtil.log(conn);
        }, this);

        ideal.on(iEvent.NetInterrupt, function(conn) {
            iUtil.log('网络连接中断');
            iUtil.log(conn);
        }, this);
    },

    onTouchConnect: function() {
        this.conn = ideal.net.create();
    },

    onTouchInterrupt: function() {
        this.conn.interrupt();
    },
});
