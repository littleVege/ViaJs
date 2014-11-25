/**
 * Created by little_vege on 2014/11/14.
 */

define(function(require,exports) {
    var globe = window;

    var util = require('via.util');
    var dom = require('via.dom');

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
            if(util.isFunction(params.success)) {
                params.success();
            }
        }
        if (util.isFunction(params.complete)) {
            params.complete();
        }
    }

    function viaJson2ReqStr(jsonObj) {
        'use strict';
        if (!util.isExist(jsonObj)) {
            return null;
        }
        if (!util.isString(jsonObj)) {
            return jsonObj;
        }
        var key,val,
            requestList = [],
            hasOwn = Object.prototype.hasOwnProperty;
        for (key in jsonObj) {
            if (val !== undefined && hasOwn.call(jsonObj, key)) {
                val = jsonObj[key];
                requestList.push(key+'='+val);
            }
        }
        return requestList.join('&');
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
        if (util.isObject(headers))
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
     @param {Function} options.complete callback at readystate == 4;
     */
    function viaAjax(options) {
        'use strict';
        var ajax,params;
        params = util.extend(util.create(ajaxDefaultOptions),options);
        ajax = getViaAjaxInstance();
        ajax.onreadystatechange = function() {
            switch (this.readyState) {
                case 0:
                case 1:
                    if(util.isFunction(params.beforesuccess)) {
                        params.beforesuccess();
                    }
                    break;
                case 2:
                    if (util.isFunction(params.await)) {
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
            params = util.extend(util.create(defaultOptions),options);
        if (util.isObject(params.data)) {

            dataStr = viaJson2ReqStr(params.data);
        } else {
            dataStr = params.data;
        }
        if (!hasQueryReg.test(params.url)) {
            url = params.url+"?";
        }
        url = url + dataStr;
        url += '&callback'+params.callback;
        scriptStr = util.template('<script type="text/javascript" src="{{url}}"></script>',{
            url:url
        });
        script = document.createElement('script');
        script.type = 'text/viajsonp';
        script.onload = script.onreadystatechange = function() {
            var txt = this.innerHTML;
            if (util.isFunction(params.success)) {
                params.success();
            }
            script.onload = script.onreadystatechange = null;
            document.head.removeChild(script);
        }
    }

    exports.ajax = viaAjax;
    exports.reqStr2Json = viaReqStr2Json;
    exports.json2ReqStr = viaJson2ReqStr;
    exports.jsonp = viaJsonp;

});