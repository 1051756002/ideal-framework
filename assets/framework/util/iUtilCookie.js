let _util = {};

/**
 * 获得Cookie
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @param    {string}
 * @return   {string|null}
 */
_util.getCookie = function (key, defval) {
    var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    }
    return iUtil.isDefine(defval) ? defval : null;
};

module.exports = _util;
