/**
 * Created by little_vege on 2014/11/11.
 */
(function(globe) {
    globe.via = globe.via||{};
    var via = globe.via;
    var document = globe.document;
    var util = via.util;
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


    /*module end*/
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


})(window);
