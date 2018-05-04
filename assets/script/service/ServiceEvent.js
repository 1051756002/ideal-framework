let _idx = 1000;
let getIndex = function() {
	return _idx++;
};

let ServiceEvent = {};

// 登录成功
ServiceEvent.LoginSuccess = getIndex();
// 登录失败
ServiceEvent.LoginFail = getIndex();

// 注册成功
ServiceEvent.RegisterSuccess = getIndex();
// 注册失败
ServiceEvent.RegisterFail = getIndex();

module.exports = ServiceEvent;
