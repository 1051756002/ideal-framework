let ServiceFunc = {};

// ############# 发送 #############

/**
 * 发送登录请求
 * @Author   Zjw
 * @DateTime 2018-05-04
 * @param    {Object}                 data 传参
 */
ServiceFunc.Send_GetAllGame = function(data) {
	let connector = ideal.net.getConnector();

	if (util.isEmpty(data.username)) {
		util.log('请输入账号');
		return;
	}

	if (util.isEmpty(data.password)) {
		util.log('请输入密码');
		return;
	}

	connector.sendMsg({
		proto_ver: 1,
		skey: '',
		uid: '',
		cmd: iCmd.C_Login,
		data: {
			username: data.username,
			password: data.password,
		},
	});
};


// ############# 接收 #############

/**
 * 接收登录请求
 * @Author   Zjw
 * @DateTime 2018-05-04
 * @param    {Object}                 data 传参
 */
ServiceFunc.Recv_GetAllGame = function(data) {
	if (data.code == 0) {
		util.log('登录成功');
		ideal.emit(iEvent.LoginSuccess);
	}
	else {
		util.log('登录失败');
		ideal.emit(iEvent.LoginFail);
	}
};

module.exports = ServiceFunc;
