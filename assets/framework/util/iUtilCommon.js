let _util = {};

/**
 * 是否为空对象
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {object} val
 * @return   {boolean}
 */
_util.isEmpty = function(val) {
    switch (typeof(val)) {
        case 'string':
            return util.trim(val).length == 0 ? true : false;
            break;
        case 'number':
            return val == 0;
            break;
        case 'object':
            return val == null;
            break;
        case 'array':
            return val.length == 0;
            break;
        case 'function':
            return false;
            break;
        default:
            return true;
    }
};

/**
 * 是否定义了该内容
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {Object} val
 * @return   {Boolean}
 */
_util.isDefine = function(val) {
    return !util.isEmpty(val);
};

/**
 * 获得地址参数列表
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @param    {string}
 * @return   {string|null}
 */
_util.getQueryString = function(name, defval) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let idx = location.search.indexOf('/');
    let r = decodeURIComponent(decodeURI(location.search.substr(1))).match(reg);
    if (r != null) {
        return decodeURIComponent(decodeURI(r[2]));
    }
    return util.isDefine(defval) ? decodeURIComponent(decodeURI(defval)) : null;
};

/**
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @param    {string}
 * @param    {string}
 * @return   {void}
 */
_util.addUrlParam = function(url, name, value) {
    if (/\?/g.test(url)) {
        if (/name=[-\w]{4,25}/g.test(url)) {
            url = url.replace(/name=[-\w]{4,25}/g, name + "=" + encodeURIComponent(value));
        } else {
            url += "&" + name + "=" + encodeURIComponent(value);
        }
    } else {
        url += "?" + name + "=" + encodeURIComponent(value);
    }
    return url;
};

_util.loadRes = function(resource, progressFn, completeFn) {
    resource = 'res/raw-assets/' + resource;
    cc.loader.load(resource, progressFn, completeFn);
};

/**
 * 加载外界JS脚本文件
 * @Author   Zjw
 * @DateTime 2018-04-20
 * @param    {string}                 url      脚本地址
 * @param    {Function}               callback 载入后的回调
 * @return   {void}
 */
_util.loadJavaScript = function(url, callback) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    if (util.isDefine(callback)) {
        script.onload = function() {
            callback();
        };
    }
    document.body.appendChild(script);
};

_util.loadSpriteFrame = function(node, url, callback, isCache, s9) {
    let sprite;
    if (node instanceof cc.Node) {
        sprite = node.getComponent(cc.Sprite);
        if (sprite == null) {
            sprite = node.addComponent(cc.Sprite);
        }
    }
    else if (node instanceof cc.Sprite) {
        sprite = node;
    }
    else {
        throw '加载SpriteFrame失败, node参数非有效参数';
    }

    let config;
    // 简单Url形式
    if (typeof url == 'string') {
        config = {
            id: url,
            type: 'png',
        };
    }
    // 配置对象形式
    else {
        config = url;
    }

    let cache = ideal.textureCache.get(config.id);
    if (cache) {
        sprite.spriteFrame = cache;
        callback && callback();
        return;
    }

    // 避免异步回调导致纹理回滚显示
    sprite.ideal_url = config.id;
    cc.loader.load(config, function(err, texture) {
        if (err) {
            throw err;
        }

        var spriteFrame = new cc.SpriteFrame(texture);
        if (s9 instanceof Array) {
            spriteFrame.insetTop = s9[0] || 0;
            spriteFrame.insetBottom = s9[1] || 0;
            spriteFrame.insetLeft = s9[2] || 0;
            spriteFrame.insetRight = s9[3] || 0;
        }

        if (isCache) {
            ideal.textureCache.add(config.id, spriteFrame);
        }

        if (sprite.ideal_url === url) {
            sprite.spriteFrame = spriteFrame;
            callback && callback();
        }
    })
};

module.exports = _util;