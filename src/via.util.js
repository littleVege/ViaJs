/**
 * Created by little_vege on 2014/11/14.
 */
(function(globe) {
    globe.via = globe.via||{};
    var via = globe.via;
    via.util = via.util||{};
    var util = via.util;

    var uniqueId = 0;

    function viaIsExist(obj) {
        return obj !== null && obj !== undefined;
    }

    function viaIsObject(obj) {
        return viaIsExist(obj)&& !viaIsArray(obj) && typeof obj === 'object';
    }

    function viaIsArray(obj) {
        if (viaIsExist(obj.isArray)) {
            return obj.isArray;
        } else {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }

    }

    function viaIsFunction(obj) {
        return viaIsExist(obj) && typeof obj === 'function';
    }

    function viaIsString(obj) {
        return viaIsExist(obj) && typeof obj === 'string';
    }

    function viaIsNumber(obj) {
        return viaIsExist(obj) && typeof obj === 'number';
    }

    function viaIsInterger(obj) {
        throw 'not implement!';
    }

    function viaIsFloat(obj) {
        throw 'not implement!';
    }

    function viaExtend(obj,source) {
        'use strict';
        var key, hasOwn = Object.prototype.hasOwnProperty;
        for(key in source) {
            if (source[key] !== undefined && hasOwn.call(source, key)) {
                obj[key] = source[key];
            }
        }
    }

    var defaultTrimReg = /^\s+|\s+$/g;
    function viaTrim(str,trimChar) {
        if (!trimChar) {
            return str.replace(defaultTrimReg,'');
        }
        var trimReg = new RegExp('^'+trimChar+'+|'+trimChar+'+$');
        trimReg.global = true;
        return str.replace(trimReg,'');
    }

    var templateRe = /(\{\{) *([\w_]+) * (\}\})/g;

    function viaTemplate(str,data) {
        return str.replace(templateRe, function (str, key) {
            var value = data[key];

            if (value === undefined) {
                throw new Error('No value provided for variable ' + str);

            } else if (viaIsFunction(data)) {
                value = value(data);
            }
            return value;
        });
    }

    function viaUniqueId(prefix) {
        prefix = prefix||'';
        return prefix+(uniqueId--);
    }


    util.create = Object.create || (function () {
        function F() {}
        return function (proto) {
            F.prototype = proto;
            return new F();
        };
    })();

    util.isExist = viaIsExist;
    util.isObject = viaIsObject;
    util.isArray = viaIsArray;
    util.isFunction = viaIsFunction;
    util.isString = viaIsString;
    util.isNumber = viaIsNumber;
    util.isInterger = viaIsInterger;
    util.isFloat = viaIsFloat;
    util.trim = viaTrim;
    util.uniqueId = viaUniqueId;
    util.extend = viaExtend;
    util.template = viaTemplate;


})(window);