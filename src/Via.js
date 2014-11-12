/**
 * Created by little_vege on 2014/11/11.
 */
(function(globe) {
    globe.via = via||{};

    function viaIsExist(obj) {
        return obj !== null && obj !== undefined;
    }

    function viaIsArray(obj) {
        return viaIsExist(obj) && Array.constructor === obj;
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

    via.isExist = viaIsExist;
    via.isArray = viaIsArray;
    via.isFunction = viaIsFunction;
    via.isString = viaIsString;
    via.isNumber = viaIsNumber;
    via.isInterger = viaIsInterger;
    via.isFloat = viaIsFloat;

    function viaExtend(obj,source) {
        'use strict';
        var key, hasOwn = Object.prototype.hasOwnProperty;
        for(key in source) {
            if (source[key] !== undefined && hasOwn.call(source, key)) {
                obj[key] = source[key];
            }
        }
    }

    via.extend = viaExtend;

    /*module:via.ajax*/

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

    /*
    * url:ajax service url,
    * data:post or get data,
    * method:get|post,
    * dataType:text|json|xml
    * beforesuccess: callback at readystate == 0,
    * success:callback at readystate == 4 && status >=200 &&status <=400,
    * comlete:callback at readystate == 4;
    * */
    var _ajaxOptionDefaults = {
        async:true,
        url:null,
        data:null,
        method:'GET',
        dataType:'text',
        beforesuccess:null,
        await:null,
        success:null,
        complete:null
    };

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

    function _getRequestDataFromJson(jsonObj) {
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

    function viaAjax(options) {
        'use strict';
        var ajax,params;
        params = viaExtend(_ajaxOptionDefaults,options);
        ajax = getViaAjaxInstance();
        ajax.onreadystatechange = function() {
            switch (this.readyState) {
                case 0:
                case 1:
                    if(viaIsFunction(params.beforesuccess)) {
                        params.beforesuccess();
                    }
                    break;
                case 2:
                    if (viaIsFunction(params.await)) {
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
        ajax.send(_getRequestDataFromJson(params.data));
    }

    via.ajax = viaAjax;
    /*module end*/

    /*module eventListener*/
    function viaFireEvent(element,eventType) {
        if (element.dispatchEvent) {
            element.dispatchEvent(eventType);
        } else if (element.fireEvent) {
            element.fireEvent('on'+ eventType);
        } else {
            throw 'your browser is not support fire event';
        }
    }

    function viaRemoveEventListener(element,eventType,eventHandler) {
        if (element.removeEventListener) {
            if (viaIsExist(eventHandler)) {
                element.removeEventListener(eventType,eventHandler);
            } else {
                element.removeEventListener(eventType);
            }
        } else if (element.detachEvent) {
            if (viaIsExist(eventHandler)) {
                element.detachEvent('on'+eventType,eventHandler);
            } else {
                element.detachEvent('on'+eventType);
            }

        }
    }

    function viaAddEventListener(element,eventType,eventHandler,useCapture) {

    }

})(window);
