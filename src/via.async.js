/**
 * Created by little_vege on 2014/11/14.
 */

define(['./via.dom'],function(dom) {
    'use strict';
    var globe = window,
        exports = {};



    function getViaAjaxInstance() {

        if (globe.XMLHttpRequest) {
            return new globe.XMLHttpRequest();
        } else if (globe.ActiveXObject) {
            return new globe.ActiveXObject('Microsoft.XMLHTTP');
        } else {
            return null;
        }
    }


    function _ajaxOnComplete(params) {
        var content = this.responseText;
        if (/json/ig.test(params.dataType)) {
            content = via.parseJSON(content);
        } else if (/xml/ig.test(params.dataType)) {
            content = this.responseXML;
        } else {
            content = this.responseText;
        }
        if(via.isFunction(params.success)) {
            params.success(content);
        }
        if (via.isFunction(params.complete)) {
            params.complete();
        }
    }

    function viaJson2ReqStr(jsonObj) {
        if (!via.isExist(jsonObj)) {
            return null;
        }
        if (via.isString(jsonObj)) {
            return jsonObj;
        }
        var key,val,
            requestList = [],
            hasOwn = Object.prototype.hasOwnProperty;
        for (key in jsonObj) {
            val = jsonObj[key];
            if (val !== undefined && hasOwn.call(jsonObj, key)) {
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
        if (via.isObject(headers))
            for(key in headers) {
                val = headers[key];
                ajaxInstance.setRequestHeader(key,val);
            }
    }
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


        var ajax,params;
        params = via.extend(ajaxDefaultOptions,options);
        ajax = getViaAjaxInstance();
        ajax.onreadystatechange = function() {
            switch (this.readyState) {
                case 0:
                case 1:
                    if(via.isFunction(params.beforesuccess)) {
                        params.beforesuccess.call(this);
                    }
                    break;
                case 2:
                    if (via.isFunction(params.await)) {
                        params.await.call(this);
                    }
                    break;
                case 3:
                    break;
                case 4:
                    _ajaxOnComplete.call(this,params);
                    break;
            }
        };

        if (params.method == ReqMethodType.get) {
            if (/\?/g.test(params.url)) {
                params.url = params.url+"?";
            } else {
                if (!/&$/.test(params.url)) {
                    params.url = params.url+"&";
                }
            }
            params.url = params.url+viaJson2ReqStr(params.data);
        }
        ajax.open(params.method,params.url,params.async);
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
            params = via.extend(via.create(defaultOptions),options);
        if (via.isObject(params.data)) {

            dataStr = viaJson2ReqStr(params.data);
        } else {
            dataStr = params.data;
        }
        if (!hasQueryReg.test(params.url)) {
            url = params.url+"?";
        }
        url = url + dataStr;
        url += '&callback'+params.callback;
        script = dom.via('script');
        script.attr('type','text/viajsonp');

        script = document.createElement('script');
        script.type = 'text/viajsonp';
        script.onload = script.onreadystatechange = function() {
            var txt = this.innerHTML;
            var content = (new Function('return '+ params.callback+'();'))();
            if (via.isFunction(params.success)) {
                params.success(content);
            }
            script.onload = script.onreadystatechange = null;
            document.head.removeChild(script);
        }
    }

    exports.ajax = viaAjax;
    exports.reqStr2Json = viaReqStr2Json;
    exports.json2ReqStr = viaJson2ReqStr;
    exports.jsonp = viaJsonp;

    return exports;

});