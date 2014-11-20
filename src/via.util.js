/**
 * Created by little_vege on 2014/11/14.
 */
(function(globe) {
    globe.via = globe.via||{};
    var via = globe.via;
    via.util = via.util||{};
    var util = via.util;
    var toStr = Object.prototype.toString;
    var hasOwn = Object.prototype.hasOwnProperty;
    var uniqueId = 0;

    function ViaClass() {
        this.initialize.apply(this, arguments);
    }

    ViaClass.prototype = {
        initialize: function(){}
    };

    ViaClass.extend = function(protoProps, staticProps) {
        var parent = this;
        var child;

        if (protoProps && via.util.hasProp(protoProps,'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function() {
                return parent.apply(this,arguments);
            };
        }

        via.util.extend(child, parent, staticProps);

        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        if (protoProps) via.util.extend(child.prototype, protoProps);

        child.__super__ = parent.prototype;

        return child;
    };
    via.Class = ViaClass;


    var JsType = {
        array:'[object Array]',
        obj: '[object Object]',
        str: '[object String]',
        fn: '[object Function]',
        num: '[object Number]',
        bool: '[object Boolean]'
    };

    function viaIsExist(obj) {
        return obj !== null && obj !== undefined;
    }

    function viaIsObject(obj) {
        return viaIsExist(obj)&& !viaIsArray(obj) && toStr.call(obj) === JsType.obj;
    }

    function viaIsBoolean(obj) {
        return viaIsExist(obj) && toStr.call(obj) === JsType.bool;
    }

    function viaIsArray(obj) {
        if (viaIsExist(obj.isArray)) {
            return obj.isArray;
        } else {
            return toStr.call(obj) === JsType.array;
        }
    }

    function viaIsFunction(obj) {
        return viaIsExist(obj) && toStr.call(obj) === JsType.fn;
    }

    function viaIsString(obj) {
        return viaIsExist(obj) && toStr.call(obj) === JsType.str;
    }

    /**
     *
     * @param {Object} obj
     * @returns {boolean} return true if is number(integer of float)
     */
    function viaIsNumber(obj) {
        return viaIsExist(obj) && typeof toStr.call(obj) === JsType.num;
    }

    /**
     *
     * @param {Object} obj
     * @returns {boolean} return true if is boolean
     */
    function viaIsInterger(obj) {
        throw 'not implement!';
    }

    function viaIsFloat(obj) {
        throw 'not implement!';
    }

    /**
     * @method via.util.each 遍历list中的所有项目
     * @param {Array} list
     * @param {Function} callBack callBack(idx,item,array)
     * @param {Object} context
     */
    function viaEach(list,callBack,context) {
        var idx,count,item,endEachFlag;
        if (!viaIsExist(context)) {
            context = this;
        }
        if (!viaIsFunction(callBack)) {
            throw new TypeError("callback need be a function");
        }
        for (idx =0,count = list.length;idx<count;idx++) {
            item = list[idx];
            endEachFlag = callBack.call(context,item,idx,list);
            if (endEachFlag) {
                break;
            }
        }
    }

    function viaHasProp(obj,key) {
        return viaIsExist(obj) && hasOwn.call(obj,key);
    }

    function viaIsArrayLike() {

    }

    function viaMerge(){
        var arg = arguments,arglen = arg.length;
    }

    function viaContain(array,key) {
        array = Array.prototype.slice.call(array,1);
        var foundIdx = -1;
        viaEach(array,function(idx,item) {
            if (key === item) {
                foundIdx = idx;
                return true;
            }
        });
        return foundIdx;

    }

    function viaArrayRemove(){

    }


    function viaExtend(obj,sources) {
        'use strict';
        var key, arg,argIdx,argCnt;
        for (argIdx = 1,argCnt = arguments.length;argIdx<argCnt;argIdx++) {
            arg = arguments[argIdx];
            for(key in arg) {
                obj[key] = arg[key];
            }
        }

    }

    var defaultTrimReg = /^\s+|\s+$/g;
    /**
     *
     * @param {String} str text that need be trim
     * @param {String} trimChar char that use to trim
     * @returns {string} trimd text
     */
    function viaTrim(str,trimChar) {
        if (!trimChar) {
            return str.replace(defaultTrimReg,'');
        }
        var trimReg = new RegExp('^'+trimChar+'+|'+trimChar+'+$');
        trimReg.global = true;
        return str.replace(trimReg,'');
    }

    var templateRe = /({{)(\.|\$|\@|\#|\w)+(}})/g;

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
    util.isBoolean = viaIsBoolean;
    util.isArray = viaIsArray;
    util.isFunction = viaIsFunction;
    util.isString = viaIsString;
    util.isNumber = viaIsNumber;
    util.isInterger = viaIsInterger;
    util.isFloat = viaIsFloat;
    util.hasProp = viaHasProp;
    util.each = viaEach;
    util.trim = viaTrim;
    util.uniqueId = viaUniqueId;
    util.extend = viaExtend;
    util.template = viaTemplate;


})(window);