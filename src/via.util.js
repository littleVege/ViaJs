/**
 * Created by little_vege on 2014/11/14.
 */

define(function() {
    var exports = {};
    var uniqueId = 0,
        toStr = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        JsType = {
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

    function viaIsArrayLike(obj) {
        return !viaIsArray(obj) &&viaIsExist(obj.length)&&viaIsNumber(obj.length);

    }

    function viaIsEmpty(obj) {
        var key;
        if (viaIsArray(obj)||viaIsArrayLike(obj)) {
            return obj.length === 0;
        }
        if (viaIsString(obj)) {
            return obj === "";
        }
        if (viaIsObject(obj)) {
            for(key in obj) {
                return false;
            }
            return true;
        }
    }

    function viaIsObject(obj) {
        return viaIsExist(obj)&& !viaIsArray(obj) && toStr.call(obj) === JsType.obj;
    }

    function viaIsBoolean(obj) {
        return viaIsExist(obj) && toStr.call(obj) === JsType.bool;
    }

    function viaIsArray(obj) {
        return toStr.call(obj) === JsType.array;
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
        return viaIsExist(obj) && toStr.call(obj) === JsType.num;
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
     * @param {Array|Object} list
     * @param {Function} callBack callBack(idx,item,array)
     * @optional {Object} context
     */
    function viaEach(list,callBack) {
        var idx,count,item,endEachFlag,context;
        if (arguments.length>2) {
            context = arguments[2];
        } else {
            context = this;
        }
        if (!viaIsFunction(callBack)) {
            throw new TypeError("callback need be a function");
        }
        if (viaIsArray(list)||viaIsArrayLike(list)) {
            for (idx=0,count=list.length;idx<count;idx++) {
                item = list[idx];
                endEachFlag = callBack.call(context,item,idx,list);
                if (endEachFlag) {
                    break;
                }
            }
        } else {
            for (idx in list) {
                if (hasOwn.call(list,idx)) {
                    item = list[idx];
                    endEachFlag = callBack.call(context,item,idx,list);
                    if (endEachFlag) {
                        break;
                    }
                }
            }
        }

    }

    function viaHasProp(obj,key) {
        return viaIsExist(obj) && hasOwn.call(obj,key);
    }



    function viaMerge(){
        var arg = arguments,arglen = arg.length;
    }

    function viaContainKey(array,key) {
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

    function viaArraySearch(array,key) {
        if (array.length>10) {
            return _binarySearch(array,key);
        } else {
            return _orginSearch(array,key);
        }
    }

    function viaArrayRemove(array,index){
        return array.splice(index,1);
    }

    function viaToArray(obj) {
        if (viaIsArray(obj)) {
            return obj;
        } else {
            return Array.prototype.slice.call(obj,0);
        }
    }

    function viaContain(array,key) {
        var contain = viaArraySearch(array,key);
        return contain >= 0;
    }

    function viaArrayDistinct(array) {
        var distinctArray = [],
            arrIdx,arrLen,currentItem;
        if (!viaIsArray(array)) {
            return array;
        }
        array = array.sort();
        currentItem = array[0];
        distinctArray.push(currentItem);
        for (arrIdx = 1,arrLen = array.length;arrIdx<arrLen;arrIdx++) {
            if(currentItem !== array[arrIdx]){
                currentItem = array[arrIdx];
                distinctArray.push(currentItem);
            }
        }
        return distinctArray;
    }

    function _orginSearch(array,key) {
        var idx = -1,arrLen;
        if (!viaIsArray(array) || !viaIsArrayLike(array)) {
            return false;
        }
        for (idx=0,arrLen = array.length;idx<arrLen;idx++) {
            if (array[idx] === key) {
                return idx;
            }
        }
        return false;
    }

    function _binarySearch(array,key) {
        var high,low,middle,arrLen;
        arrLen = array.length;
        high = arrLen-1;
        low = 0;
        middle = Math.floor((high+low)/2);
        while(high>low) {
            if (array[middle] === key){
                return middle;
            } else if (array[middle] > key) {
                high = middle-1;
            } else {
                low = middle+1;
            }
            middle = Math.floor((high+low)/2);
        }
        return false;
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

    var templateRe = /({{)(\.|\$|@|#|\w)+(}})/g;

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

    function _hyphenToCamelCase(text) {
        var firstCharUpper = false;
        if (arguments.length>1) {
            firstCharUpper = arguments[1];
        }
        text = text.replace(/(\-[a-z])/g, function($1){
            return $1.toUpperCase().replace('-', '');
        });
        if (!firstCharUpper) {
            return text.replace(/^\w/,function($1) {
                return $1.toLowerCase();
            });
        } else {
            return text;
        }
    }

    function viaUniqueId(prefix) {
        prefix = prefix||'';
        return prefix+(uniqueId--);
    }

    function viaToCamelCase(text) {
        /*TODO:支持多种命名方式转换为camelcase*/
        return _hyphenToCamelCase(text);
    }

    function viaEscapeHtml(text) {
        var escapeHtmlReg = /["&<>\/]/g;
        text.replace(escapeHtmlReg,_escapeHtmlChar);
    }

    function _escapeHtmlChar(char) {
        switch (char) {
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '&':
                return '&amp;';
            case '"':
                return '&quot;';
            default :
                return char;
        }
    }

    function viaParseJson(str) {
        return JSON.parse(str);
    }

    function viaParseXml(str) {

    }

    exports.create = Object.create || (function () {
        function F() {}
        return function (proto) {
            F.prototype = proto;
            return new F();
        };
    })();

    exports.isExist = viaIsExist;
    exports.isEmpty = viaIsEmpty;
    exports.isObject = viaIsObject;
    exports.isBoolean = viaIsBoolean;
    exports.isArray = Array.isArray||viaIsArray;
    exports.isArrayLike = viaIsArrayLike;
    exports.isFunction = viaIsFunction;
    exports.isString = viaIsString;
    exports.isNumber = viaIsNumber;
    exports.isInterger = viaIsInterger;
    exports.isFloat = viaIsFloat;
    exports.hasProp = viaHasProp;
    exports.each = viaEach;
    exports.trim = viaTrim;
    exports.uniqueId = viaUniqueId;
    exports.extend = viaExtend;
    exports.template = viaTemplate;
    exports.search = viaArraySearch;
    exports.distinct = viaArrayDistinct;
    exports.toCamelCase = viaToCamelCase;
    exports.toArray = viaToArray;
    exports.contain = viaContain;
    exports.escape = viaEscapeHtml;
    exports.parseJSON = viaParseJson;

    return exports;
});