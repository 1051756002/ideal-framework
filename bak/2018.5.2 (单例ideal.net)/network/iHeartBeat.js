let heartbeat = {};
let stid_beat = 0;

// 最后时间
let lastTime = 0;
// 发送时间
let sendTime = 0;
// 心跳范围时间
let beatTimeLimit = 10000;

heartbeat.start = function() {
	this.next();

	ideal.net.on('beat', this.beat, this);
};

heartbeat.beat = function() {
	util.log('du ~');
	lastTime = Date.now();
};

heartbeat.next = function() {
	let currTime = Date.now();

	lastTime || (lastTime = currTime);
	sendTime || (sendTime = currTime);

	if ((currTime - lastTime) > beatTimeLimit || (currTime - sendTime) > beatTimeLimit) {
		sendTime = undefined;
		ideal.net.interrupt();
		return;
	}

	ideal.net.send('beat');
	sendTime = currTime;

	stid_beat = setTimeout(this.next.bind(this), 1000);
};

heartbeat.stop = function() {
	clearTimeout(stid_beat);
	ideal.net.off('beat');
};

module.exports = heartbeat;