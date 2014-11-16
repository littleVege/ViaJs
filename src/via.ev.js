/**
 * Created by little_vege on 2014/11/15.
 */
(function(globe) {
    globe.via = globe.via||{};
    var via = globe.via,
        ev;
    via.ev = via.ev||{};
    ev = via.ev;

    /*module eventListener*/

    var domEvents = ['click','dbclick','mousemove','mouseover','mouseenter','mouseout','mouseleave','mouseup','mousedown','mousemove',
        'reset','resize','select','submit','abort','blur','change','error','focus',
        'keydown','keypress','keyup',
        'load','unload'];

    function viaFireDomEvent(element, eventType) {
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

        } else {
            element['on'+eventType] = null;
        }
    }

    function viaAddDomEvent(element, eventType, eventHandler, useCapture) {
        if (!viaIsFunction(eventHandler)) {
            return;
        }
        if (element.addEventListener) {
            useCapture = viaIsExist(useCapture)?useCapture:false;
            element.addEventListener(eventType,eventHandler,useCapture);
        } else if (element.attachEvent) {
            element.attachEvent('on'+eventType,eventHandler);
        } else {
            element['on'+eventType] = eventHandler;
        }
    }

    function viaON(eventType,eventHandler,useCapture) {
        viaAddDomEvent(this, eventType, eventHandler, useCapture);
    }

    function viaFire(eventType) {
        viaFireDomEvent(this, eventType);
    }

    function viaOff(eventType,eventHandler) {
        viaRemoveDomEvent(this, eventType, eventHandler);
    }
    /*module end*/

})(window);