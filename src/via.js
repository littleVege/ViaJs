/**
 * Created by little_vege on 2014/11/23.
 */
(function(globe) {
    globe.via = globe.via||{};
    var via = globe.via;
    via.util = via.util||{};
    var util = via.util;
    var toStr = Object.prototype.toString;
    var hasOwn = Object.prototype.hasOwnProperty;
    var uniqueId = 0;




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

    function viaIsArrayLike(obj) {
        return !viaIsArray(obj) && obj.prototype.constructor === Array;

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
            Array.prototype.slice.call(obj,1);
        }
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

    function _hyphenToCamelCase(text) {
        var firstCharUpper = false;
        if (arguments.length>1) {
            firstCharUpper = arguments[1];
        }
        text = text.replace(/(\-[a-z])/g, function($1){
            return $1.toUpperCase().replace('-', '');
        });
        if (!firstCharUpper) {
            return text.replace(/^\w/,'$1'.toLowerCase());
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
    util.isArray = Array.isArray||viaIsArray;
    util.isArrayLike = viaIsArrayLike;
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
    util.search = viaArraySearch;
    util.distinct = viaArrayDistinct;
    util.toCamelCase = viaToCamelCase;
    util.toArray = viaToArray;


    /*module dom*/
    var document = globe.document;
    via.dom = via.dom||{};
    var dom = via.dom;
    var htmlReg = /<(\w+?)(\s?)[^>]+>/g;
    var tagNameReg = /^[a-zA-z]+$/ig;
    var attriReg = /\w+=['|"]\w+['|"]/g;
    var isSelectorReg = /([#.:]\w+([\[:]*([\-\(\)]|\w)+(=[\w_-]+)?[\]]?)?)/ig;

    function viaCreateDom(selector) {
        var tmpDom;
        if(via.util.isString(selector)) {
            if (viaIsHtml(selector)) {
                tmpDom = document.createElement('div');
                tmpDom.innerHTML = selector;
                return via.util.toArray(tmpDom.childNodes);
            } else {
                return document.createElement(selector);
            }
        } else {
            throw new TypeError();
        }


    }

    /**
     @method via.filter
     @param {string|NodeList|Node} selector
     @optional {Node} dom context of the selector, optional
     @return {NodeList} return query result
     */
    function viaQueryAll(selector) {
        var dom = document;
        if (arguments.length>1) {
            dom = arguments[1];
        }
        if (viaIsSelector(selector)) {
            if (dom.querySelectorAll) {
                return dom.querySelectorAll(selector);
            } else {
                throw "not implement yet!";
                /*TODO:use sizzle to query selector*/
            }
        } else if (viaIsHtmlNode(selector)) {
            return [selector];
        } else if (viaIsHtmlNodeList(selector)) {
            return selector;
        } else {
            throw new TypeError('first argument should be selector or htmlNode or htmlNodeList');
        }
    }

    /**
     @method via.query
     @param {string} selector
     @optional {Node} dom context of the selector, optional
     @return {Node} return query result
     */
    function viaQuery(selector) {
        var dom;
        if (arguments.length>1) {
            dom = arguments[1];
        }
        dom = dom||document;
        if (dom.querySelector) {
            return dom.querySelector(selector);
        } else {
            if (globe.sizzle) {
                /*if not found querySelector api, then use sizzle to query selector*/
                return globe.sizzle(selector);
            }
        }
    }


    /*set or read attribute*/

    var IEfixAttr = {
        acceptcharset: "acceptCharset",
        accesskey: "accessKey",
        allowtransparency: "allowTransparency",
        bgcolor: "bgColor",
        cellpadding: "cellPadding",
        cellspacing: "cellSpacing",
        "class":  "className",
        colspan:  "colSpan",
        checked: "defaultChecked",
        selected: "defaultSelected",
        "for":  "htmlFor" ,
        frameborder:  "frameBorder",
        hspace:  "hSpace",
        longdesc:  "longDesc",
        maxlength:  "maxLength",
        marginwidth:  "marginWidth",
        marginheight:  "marginHeight",
        noresize:  "noResize",
        noshade:  "noShade",
        readonly: "readOnly",
        rowspan:  "rowSpan",
        tabindex:  "tabIndex",
        valign:  "vAlign",
        vspace:  "vSpace"
    };

    function _setAttribute(dom,key,val) {
        /*TODO:ie fixed attribute*/
        if (key == "style") {
            dom.style.setAttribute('cssText',val);
        } else {
            dom.setAttribute(key,val);
        }
    }

    function _getAttribute(node,key) {
        /*TODO:ie fixed attribute*/
        return node.getAttribute(key);
    }

    function viaAttr(selector,key) {
        var arg,argLen,
            nodes,val;
        arg = arguments;
        argLen = arg.length;
        nodes = viaQueryAll(selector);
        if (nodes.length>0) {
            if (argLen>2) {
                val = arg[2];
                /*TODO:key can be object or string*/
                via.util.each(selector,function(node,idx){
                    _setAttribute(node,key,val);
                });
                return val;
            } else {
                return _getAttribute(nodes[0],key);
            }
        }
    }

    /*set or read attribute end*/

    /*set or read css*/

    function viaCss(selector,key) {
        var nodes,val;
        nodes = viaQueryAll(selector);
        if (arguments.length>2) {
            val = arguments[2];
            via.util.each(nodes,function(node,idx) {
                _setCss(node,key,val);
            },nodes);
            return val;
        } else {
            if (via.util.isObject(key)) {
                via.util.each(nodes,function(node,idx) {
                    via.util.each(key,function(val,key) {
                        _setCss(node,key,val);
                    });
                });
                /*TODO:need return a string value*/
                return key;
            } else {
                return _getCss(nodes[0],key);
            }
        }
    }

    function _getCss(node,key) {
        var camelCaseStyleName;
        camelCaseStyleName = via.util.toCamelCase(key);
        return node.style[camelCaseStyleName];
    }

    function _setCss(node,key,val) {
        var camelCaseStyleName;
        camelCaseStyleName = via.util.toCamelCase(key);
        /*TODO:if can`t find style*/
        node.style[camelCaseStyleName] = val;
    }
    /*set or read css end*/


    /*add or remove class*/

    function viaAddClass(selector,className) {
        var nodes;
        nodes = viaQueryAll(selector);
        via.util.each(nodes,function(node,idx){
            _addClass(node,className);
        },nodes);
    }

    function viaRemoveClass(selector,className) {
        var nodes;
        nodes = viaQueryAll(selector);
        via.util.each(nodes,function(node,idx) {
            _removeClass(node,className);
        },nodes);
    }

    var whiteSpaceReg = /\s+/;
    function _addClass(node,className) {
        var classes;
        classes = node.className.split(whiteSpaceReg);
        if (via.util.isString(className)) {
            classes.push(className);
        } else if (via.util.isArray(className)) {
            classes.concat(className);
        }
        classes = via.util.distinct(classes);
        node.className = classes.join(' ');
    }

    function _removeClass(node,className) {
        var classes,
            clIdx,clLen,
            rmIdx,rmLen;
        classes = node.className.split(whiteSpaceReg);
        if (via.util.isArray(className)) {
            for(clIdx = 0,clLen = classes.length;clIdx<clLen;clIdx++) {
                for (rmIdx=0,rmLen=className.length;rmIdx<rmLen;rmIdx++) {
                    if (classes[clIdx] == className[rmIdx]) {
                        classes.splice(clIdx,1);
                    }
                }
            }
        } else {
            rmIdx = via.util.search(classes,className);
            if (rmIdx) {
                classes.splice(rmIdx,1);
            }
        }
        return className;
    }

    /*add or remove class*/

    /*get or set data-*/
    function viaData(selector,key) {

    }

    function _setData(node,key,val) {
        _setAttribute(node,"data-"+key,val);
    }

    function _getData(node,key) {
        return _getAttribute(node,"data-"+key);
    }
    /*dom eventListener*/

    var domEvents = ['click','dbclick','mousemove','mouseover','mouseenter','mouseout','mouseleave','mouseup','mousedown','mousemove',
        'reset','resize','select','submit','abort','blur','change','error','focus',
        'keydown','keypress','keyup',
        'load','unload'];

    function viaTriggerDomEvent(element, eventType) {
        if (element.dispatchEvent) {
            element.dispatchEvent(eventType);
        } else if (element.fireEvent) {
            element.fireEvent('on'+ eventType);
        } else {
            throw 'your browser is not support fire event';
        }
    }

    function viaRemoveDomEvent(element, eventType, eventHandler) {
        if (element.removeEventListener) {
            if (via.util.isExist(eventHandler)) {
                element.removeEventListener(eventType,eventHandler);
            } else {
                element.removeEventListener(eventType);
            }
        } else if (element.detachEvent) {
            if (via.util.isExist(eventHandler)) {
                element.detachEvent('on'+eventType,eventHandler);
            } else {
                element.detachEvent('on'+eventType);
            }

        } else {
            element['on'+eventType] = null;
        }
    }

    function viaAddDomEvent(element, eventType, eventHandler) {
        var useCapture = false;
        if (arguments.length>3) {
            useCapture = arguments[3];
        }
        if (!via.util.isFunction(eventHandler)) {
            return;
        }
        if (element.addEventListener) {
            element.addEventListener(eventType,eventHandler,useCapture);
        } else if (element.attachEvent) {
            element.attachEvent('on'+eventType,eventHandler);
        } else {
            element['on'+eventType] = eventHandler;
        }
    }
    /*eventListener end*/

    /*event delegate*/

    function viaDelegateDomEvent(htmlNode,targetSelector,eventType,eventHandler) {
        if (!viaIsHtmlNode(htmlNode)) {
            throw new TypeError('type can only be htmlNode');
        }
        viaAddDomEvent(htmlNode,eventType,function(e) {
            var ev,target;
            ev = e||window.event;
            target = ev.target||ev.srcElement;
            if (viaIsMatchesSelector(target,targetSelector)) {
                eventHandler.call(target,e);
            }
        });
    }

    /*event delegate end*/


    /*test given obj is dom(selector|node|nodeList|html)*/

    function viaIsSelector(obj) {
        if (!util.isString(obj)){
            return false;
        }
        return isSelectorReg.test(obj);
    }

    function viaIsHtml(obj) {
        return htmlReg.test(obj);
    }

    function viaIsHtmlTag(obj) {
        return tagNameReg.test(obj);
    }

    function viaIsHtmlNode(obj) {
        return via.util.hasProp(obj.tagName);
    }

    function viaIsHtmlNodeList(obj) {
        if (via.util.isArrayLike(obj)) {
            if (obj.length>0) {
                return viaIsHtmlNode(obj[0]);
            }
        }
        return false;
    }

    /**
     *
     * @param {HtmlElement} node
     * @param {String} selector
     * @returns {*}
     */
    function viaIsMatchesSelector(node,selector) {
        var matchFunc;
        matchFunc = node.webkitMatchesSelector || node.msMatchesSelector || node.mozMatchesSelector || node.oMatchesSelector;
        if (matchFunc) {
            return matchFunc(selector);
        } else {
            viaMatchs(node,selector);
        }
    }

    function viaMatchs(node,selector){

    }

    /*test given obj is dom end*/



    dom.create = viaCreateDom;
    dom.query = viaQuery;
    dom.queryAll = viaQueryAll;
    dom.attr = viaAttr;
    dom.css = viaCss;
    dom.addClass = viaAddClass;
    dom.removeClass = viaRemoveClass;

    dom.isHtmlNode = viaIsHtmlNode;
    dom.isHtmlNodeList= viaIsHtmlNodeList;
    dom.on = viaAddDomEvent;
    dom.trigger = viaTriggerDomEvent;
    dom.remove = viaRemoveDomEvent;
    dom.delegate = viaDelegateDomEvent;

    /*module end*/


    /*module:via.ajax*/
    via.async = via.async||{};
    var async = via.async;
    function getViaAjaxInstance() {
        'use strict';
        if (globe.XMLHttpRequest) {
            return new globe.XMLHttpRequest();
        } else if (globe.ActiveXObject) {
            return new globe.ActiveXObject('Microsoft.XMLHTTP');
        } else {
            return null;
        }
    }


    function _ajaxOnComplete(params) {
        if (this.status >=200 && this.status <400) {
            if(viaIsFunction(params.success)) {
                params.success();
            }
        }
        if (viaIsFunction(params.complete)) {
            params.complete();
        }
    }

    function viaJson2ReqStr(jsonObj) {
        'use strict';
        if (!via.util.isExist(jsonObj)) {
            return null;
        }
        if (!via.util.isString(jsonObj)) {
            return jsonObj;
        }
        var key,val,
            reqestList = [],
            hasOwn = Object.prototype.hasOwnProperty;
        for (key in jsonObj) {
            if (val !== undefined && hasOwn.call(jsonObj, key)) {
                val = jsonObj[key];
                reqestList.push(key+'='+val);
            }
        }
        return reqestList.join('&');
    }

    function viaReqStr2Json(requestString) {
        var requests,i,len,pair,resultJson;
        requests = requestString.split('&');
        len = requests.length;
        resultJson = {};
        for(i = 0;i<len;i++) {
            pair = requests[i].split('=');
            if (pair.length>1) {
                resultJson[pair[0]] = pair[1];
            }
        }
        return resultJson;

    }



    var ReqMethodType = {get:'get','put':'put',post:'post',delete:'delete'};

    function _setRequestHeaders(ajaxInstance,headers) {
        var key,val;
        if (via.util.isObject(headers))
            for(key in headers) {
                val = headers[key];
                ajaxInstance.setRequestHeader(key,val);
            }
    }

    var ajaxDefaultOptions = {
        async:true,
        url:null,
        data:null,
        method:'GET',
        dataType:'text',
        headers:{},
        beforesuccess:null,
        await:null,
        success:null,
        complete:null
    };
    /**
     @param {String} options.url ajax service url,
     @param {String|Object} options.data post or get data,
     @param {String} options.method get|post|put|delete,
     @param {string} options.dataType text|json|xml
     @param {Function} options.beforesuccess callback at readystate == 0,
     @param {Function} options.success callback at readystate == 4 && status >=200 &&status <=400,
     @param {Function} options.comlete callback at readystate == 4;
     */
    function viaAjax(options) {
        'use strict';
        var ajax,params;
        params = via.util.extend(via.util.create(ajaxDefaultOptions),options);
        ajax = getViaAjaxInstance();
        ajax.onreadystatechange = function() {
            switch (this.readyState) {
                case 0:
                case 1:
                    if(via.util.isFunction(params.beforesuccess)) {
                        params.beforesuccess();
                    }
                    break;
                case 2:
                    if (via.util.isFunction(params.await)) {
                        params.await();
                    }
                    break;
                case 3:
                    break;
                case 4:
                    _ajaxOnComplete(params);
                    break;
            }
        };
        ajax.open(params.url,params.method,params.async);
        if (params.method == ReqMethodType.post) {
            ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        }

        ajax.send(viaJson2ReqStr(params.data));
    }
    /*module end*/

    /*module jsonp*/
    var hasQueryReg = /\?/;
    function viaJsonp(options) {
        var script,scriptStr,url,dataStr;
        var defaultOptions = {
                url:null,
                data:null,
                callback:null,
                success:null
            },
            params = via.util.extend(via.util.create(defaultOptions),options);
        if (via.util.isObject(params.data)) {

            dataStr = viaJson2ReqStr(params.data);
        } else {
            dataStr = params.data;
        }
        if (!hasQueryReg.test(params.url)) {
            url = params.url+"?";
        }
        url = url + dataStr;
        url += '&callback'+params.callback;
        scriptStr = via.util.template('<script type="text/javascript" src="{{url}}"></script>',{
            url:url
        });
        script = globe.document.createElement('script');
        script.type = 'text/viajsonp';
        script.onload = script.onreadystatechange = function() {
            var txt = this.innerHTML;
            if (via.util.isFunction(params.success)) {
                params.success();
            }
            script.onload = script.onreadystatechange = null;
            globe.document.head.removeChild(script);
        }
    }

    async.ajax = viaAjax;
    async.reqStr2Json = viaReqStr2Json;
    async.json2ReqStr = viaJson2ReqStr;
    async.jsonp = viaJsonp;


})(window);