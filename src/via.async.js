/**
 * Created by little_vege on 2014/11/14.
 */
(function(globe) {
    /*module:via.ajax*/
    globe.via = globe.via||{};
    var via = globe.via;
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
        if (!viaIsExist(jsonObj)) {
            return null;
        }
        if (!viaIsString(jsonObj)) {
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

    function viaReqStr2Json(requestString,) {
        var requests,key,val;
        requests = requestString.split('&');

    }



    var ReqMethodType = {get:'get',post:'post',delete:'delete'};

    function _setRequestHeaders(ajaxInstance,headers) {
        var key,val;
        if (via.util.isObject(headers))
        for(key in headers) {
            val = headers[key];
            ajaxInstance.setRequestHeader(key,val);
        }
    }

    function viaAjax(options) {
        'use strict';
        var ajax,params;
        /*
         * url:ajax service url,
         * data:post or get data,
         * method:get|post,
         * dataType:text|json|xml
         * beforesuccess: callback at readystate == 0,
         * success:callback at readystate == 4 && status >=200 &&status <=400,
         * comlete:callback at readystate == 4;
         * */
        var defaultOptions = {
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
        params = via.util.extend(via.util.create(defaultOptions),options);
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

    async.ajax = viaAjax;
    async.reqStr2Json = ;
    async.json2ReqStr = viaJson2ReqStr;
    /*module end*/

})(window);