(function(factory) {
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define("iCookie", [], factory);
    } else if (typeof exports === 'object') {
        exports.iCookie = factory();
    } else {
        window.iCookie = factory();
    }
})(function() {

    var docUrl = 'https://github.com/oxDesigner/iCookie/blob/master/README.md',
        cookieObj = {},
        optionObj = {
            path: '/'
        },
        cookieStr = '',
        class2type = {}.toString;

    function iCookie() {

    }

    function checkType(obj) {
        return class2type.call(obj);
    }

    function setCookieStr(key, value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        return key + "=" + escape(value);
    }

    function setOptionStr(config) {
        var configArr = [];
        for (var key in config) {
            var value = config[key];
            if (key === 'expires') {
                value = getExpires(config[key])
            }
            configArr.push(key + '=' + value);
        }
        return configArr.join(';');
    }

    function getCookieObj() {
        if (cookieStr !== document.cookie) {
            cookieStr = document.cookie;
            cookieObj = {};
            if (cookieStr) {
                var cookieArr = cookieStr.split('; ');
                cookieArr.forEach(function(item) {
                    var _cookieArr = item.split('=');
                    cookieObj[_cookieArr[0]] = unescape(_cookieArr[1]);
                });
            }
        }
        return cookieObj;
    }

    function getExpires(i) {
        var date = new Date(),
            re = /^\d+$|^(\d+)([a-z])$/;
        if (re.test(i)) {
            if (typeof i === 'number') {
                date.setDate(date.getDate() + i);
            } else {
                var $1 = Number(RegExp.$1),
                    $2 = RegExp.$2;
                switch ($2) {
                    case 'y':
                        date.setFullYear(date.getFullYear() + $1);
                        break;
                    case 'm':
                        date.setMonth(date.getMonth() + $1);
                        break;
                    case 'd':
                        date.setDate(date.getDate() + $1);
                        break;
                    case 'h':
                        date.setHours(date.getHours() + $1);
                        break;
                    default:
                        break;
                }
            }
        } else {
            throw new Error('过期时间必须为数字或字符串：1y：1年、2m：2月、3d&3：3天、4h：4小时， 看文档' + docUrl);
        }

        return date.toUTCString();
    }

    function removeFn(iCookie, key, options) {
        if (iCookie.get(key) != null) {
            if (options) {
                options.expires = -1;
            } else {
                options = -1;
            }
            iCookie.set(key, '', options);
        } else {
            throw new Error('iCookie.remove: 删除失败，看文档 ' + docUrl);
        }
    }

    iCookie.extend = function() {
        var options, name, copy,
            target = {},
            i = 0,
            length = arguments.length;

        if (length === 1) {
            target = this;
        }

        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    }

    iCookie.extend({
        set: function() {
            var args = arguments,
                arg1,
                arg2,
                arg3,
                cookieArr = [],
                configObj = iCookie.configObj || {},
                configStr,
                key;
            if (args.length === 0) {
                throw new Error('iCookie.set: 你参数没写，看文档 ' + docUrl);
                return;
            }

            if (args.length === 1) {
                arg1 = args[0];
                if (checkType(arg1) === '[object Object]') {
                    configStr = setOptionStr(iCookie.extend(optionObj, configObj));
                    for (key in arg1) {
                        cookieArr.push(setCookieStr(key, arg1[key]) + ';' + configStr);
                    }

                } else {
                    throw new Error('iCookie.set: 一个参数必须为json， 看文档 ' + docUrl);
                    return;
                }
            }
            if (args.length === 2) {
                arg1 = args[0];
                arg2 = args[1];
                if (typeof arg1 === 'string') {
                    configStr = setOptionStr(iCookie.extend(optionObj, configObj));
                    cookieArr.push(setCookieStr(arg1, arg2) + ';' + configStr);
                } else if (checkType(arg1) === '[object Object]' && checkType(arg2) === '[object Object]') {
                    configStr = setOptionStr(iCookie.extend(optionObj, configObj, arg2));
                    for (key in arg1) {
                        cookieArr.push(setCookieStr(key, arg1[key]) + ';' + configStr);
                    }
                } else {
                    throw new Error('iCookie.set: 你参数写错了， 看文档 ' + docUrl);
                    return;
                }
            }
            if (args.length === 3) {
                arg1 = args[0];
                arg2 = args[1];
                arg3 = args[2];
                if (typeof arg1 === 'string') {
                    var arg3Type = checkType(arg3);
                    if (arg3Type === '[object Number]') {
                        configStr = setOptionStr(iCookie.extend(optionObj, configObj, {
                            expires: arg3
                        }));
                        cookieArr.push(setCookieStr(arg1, arg2) + ';' + configStr);
                    } else if (arg3Type === '[object Object]') {
                        configStr = setOptionStr(iCookie.extend(optionObj, configObj, arg3));
                        cookieArr.push(setCookieStr(arg1, arg2) + ';' + configStr);
                    }
                } else {
                    throw new Error('iCookie.set: 你参数写错了， 看文档 ' + docUrl);
                    return;
                }
            }
            if (args.length > 3) {
                throw new Error('iCookie.set: 你参数写错了， 看文档 ' + docUrl);
                return;
            }
            cookieArr.forEach(function(item) {
                document.cookie = item;
            });
            return cookieArr;
        },
        get: function() {
            var args = arguments,
                arg;
            if (args.length === 0) {
                return getCookieObj();
            }
            if (args.length === 1) {
                arg = args[0];
                var cookieObj = getCookieObj();
                if (typeof arg === 'string') {
                    return cookieObj[arg];
                } else if (checkType(arg) === '[object Array]') {
                    var obj = {};
                    arg.forEach(function(item) {
                        obj[item] = cookieObj[item];
                    })
                    return obj;
                } else {
                    throw new Error('iCookie.get: 你参数写错了， 看文档 ' + docUrl);
                    return;
                }
            }
            if (args.length > 1) {
                throw new Error('iCookie.get: 你参数写错了， 看文档 ' + docUrl);
                return;
            }
        },
        remove: function() {
            var args = arguments,
                arg1, arg2;
            if (args.length === 0) {
                throw new Error('iCookie.remove: 你参数写错了， 看文档 ' + docUrl);
                return;
            }
            if (args.length === 1) {
                arg1 = args[0];
                if (typeof arg === 'string') {
                    removeFn(iCookie, arg1);
                }
            }

            if (args.length === 2) {
                arg1 = args[0];
                arg2 = args[1];
                if (typeof arg1 === 'string' && checkType(arg2) === '[object Object]') {
                    removeFn(iCookie, arg1, arg2);
                }
            }

            if (args.length > 2) {
                throw new Error('iCookie.remove: 你参数写错了， 看文档 ' + docUrl);
            }
        },
        config: function(config) {
            iCookie.configObj = config;
        }
    });

    return iCookie;

})