let heartbeat = function() {
	this.STID_BEAT = 0;

	// 最后时间
	this.lastTime = 0;
	// 发送时间
	this.sendTime = 0;
	// 心跳范围时间
	this.beatTimeLimit = 10000;
};

heartbeat.prototype.start = function(connector) {
	if (!connector) {
		return;
	}

	this.conn = connector;

	this.next();

	ideal.net.on('beat', this.onBeat, this);
};

heartbeat.prototype.next = function() {
	let currTime = Date.now();

	this.lastTime || (this.lastTime = currTime);
	this.sendTime || (this.sendTime = currTime);

	if ((currTime - this.lastTime) > this.beatTimeLimit || (currTime - this.sendTime) > this.beatTimeLimit) {
		this.sendTime = undefined;
		this.conn.interrupt();
	}

	this.conn.send('beat');
	this.sendTime = currTime;

	this.STID_BEAT = setTimeout(this.next.bind(this), 1000);
};

heartbeat.prototype.stop = function() {
	clearTimeout(this.STID_BEAT);
	ideal.net.off('beat');
};

heartbeat.prototype.onBeat = function() {
	util.log('du ~');
	this.lastTime = Date.now();
};

module.exports = heartbeat;
