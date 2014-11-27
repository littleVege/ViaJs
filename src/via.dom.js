/**
 * Created by little_vege on 2014/11/11.
 */

define(function(require,exports,module) {
    var util = require('via.util');
    var oop= require('via.oop');


    var attriReg = /\w+=['|"]\w+['|"]/g;


    var Via = oop.Class.extend({
        initialize:function(nodeList) {
            var idx,len=0;
            if (util.isArray(nodeList)||util.isArrayLike(nodeList)) {
                for (idx=0,len = nodeList.length;idx<len;idx++) {
                    this[idx] = nodeList[idx];
                }
            }
            this.length = len;
        },
        attr:function(key) {
            var arg,argLen,val;
            arg = arguments;
            argLen = arguments.length;
            if (this.length>0) {
                if (argLen>1) {
                    val = arg[1];
                    /*TODO:key can be object or string*/
                    util.each(this,function(node,idx){
                        _setAttribute(node,key,val);
                    });
                    return this;
                } else {
                    if (this[0]) {
                        return _getAttribute(this[0],key);
                    } else {
                        return null;
                    }

                }
            }
        },
        css:function(key) {
            var val;
            if (arguments.length>1) {
                val = arguments[1];
                util.each(this,function(node,idx) {
                    _setCss(node,key,val);
                });
                return this;
            } else {
                if (util.isObject(key)) {
                    util.each(this,function(node,idx) {
                        util.each(key,function(val,key) {
                            _setCss(node,key,val);
                        });
                    });
                    /*TODO:need return a string value*/
                    return this;
                } else {
                    if (this[0]) {
                        return _getCss(this[0],key);
                    } else {
                        return null;
                    }

                }
            }
        },
        find:function(selector) {
            if (this[0]&&viaIsSelector(selector)) {
                return new Via(viaQueryAll(selector,this[0]));
            }
            return null;
        },
        parent:function(selector) {
            throw "not implement";
        },
        on:function(type,eventHandler) {
            var arg,argLen,useCapture;
            arg = arguments;
            argLen = arg.length;
            useCapture = false;
            if (argLen>2) {
                if (util.isBoolean(arg[2])) {
                    useCapture = arg[2];
                }
            }
            util.each(this,function(element,idx) {
                viaAddDomEvent(element,type,eventHandler,useCapture);
            });
            return this;
        },
        trigger:function(type) {
            util.each(this,function(element) {
                viaTriggerDomEvent(element,type);
            });
        },
        off:function(type,eventHandler) {
            util.each(this,function(element) {
                viaRemoveDomEvent(element,type,eventHandler);
            })
        },
        delegate:function(type,selector,eventHandler) {
            if (this[0]) {
                viaDelegateDomEvent(this[0],selector,type,eventHandler);
            }
        },
        addClass:function(className) {
            util.each(this,function(element) {
                _addClass(element,className);
            });
        },
        removeClass:function(className) {
            util.each(this,function(element) {
                _removeClass(element,className);
            });
        },
        text:function() {
            var arg,argLen,text;
            arg = arguments;
            if (arg>0) {
                text = arg[0];
            }
            if (util.isExist(text)) {
                util.each(this,function(element) {
                    viaSetText(element,text);
                });
                return this;
            } else {
                if (util.isExist(this[0])) {
                    return viaGetText(this[0]);
                }
            }
        },
        html:function() {
            var arg,html;
            arg = arguments;
            if (arg>0) {
                html = arg[0];
            }
            if (util.isExist(html)) {
                util.each(this,function(element) {
                    element.innerHTML = html;
                });
                return this;
            } else {
                if (util.isExist(this[0])) {
                    return this[0].innerHTML;
                }
            }
        },
        append:function() {

        },
        appendTo:function() {

        },
        is:function(selector) {
            if (util.isExist(this[0])){
                return viaIsMatchesSelector(this[0],selector);
            }
            return false;
        },
        toString:function() {
            return "[object Via]"
        }
    });

    var via = function(selector) {
        var nodes;
        if (viaIsSelector(selector)) {
            nodes = viaQueryAll(selector);
        }
        if (viaIsHtml(selector)) {
            nodes = viaCreateDom(selector);
        }
        if (viaIsHtmlTag(selector)) {
            nodes = [viaCreateDom(selector)];
        }
        if (viaIsHtmlNode(selector)) {
            nodes = [selector];
        }
        if (viaIsHtmlNodeList(selector)) {
            nodes = selector;
        }
        if (!nodes) {
            throw new TypeError();
        }
        return new Via(nodes);
    };


    function viaCreateDom(selector) {
        var tmpDom;
        if(util.isString(selector)) {
            if (viaIsHtml(selector)) {
                tmpDom = document.createElement('div');
                tmpDom.innerHTML = selector;
                return tmpDom.childNodes;
            } else if (viaIsHtmlTag(selector)) {
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
            if (sizzle) {
                /*if not found querySelector api, then use sizzle to query selector*/
                return sizzle(selector);
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
                util.each(selector,function(node,idx){
                    _setAttribute(node,key,val);
                });
                return val;
            } else {
                return _getAttribute(nodes[0],key);
            }
        }
    }

    /*set or read attribute end*/

    function viaSetText(node,text) {
        if (util.isExist(node.innerText)) {
            node.innerText = text;
        }else if (util.isExist(node.textContent)) {
            node.textContent = text;
        } else {
            node.innerHTML = util.escape(text);
        }
    }

    function viaGetText(node) {
        if (util.isExist(node.innerText)) {
            return node.innerText;
        }else if (util.isExist(node.textContent)) {
            return node.textContent;
        } else {
            /*TODO：有问题*/
            return node.innerHTML;
        }
    }

    /*set or read css*/

    function viaCss(selector,key) {
        var nodes,val;
        nodes = viaQueryAll(selector);
        if (arguments.length>2) {
            val = arguments[2];
            util.each(nodes,function(node,idx) {
                _setCss(node,key,val);
            },nodes);
            return val;
        } else {
            if (util.isObject(key)) {
                util.each(nodes,function(node,idx) {
                    util.each(key,function(val,key) {
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
        camelCaseStyleName = util.toCamelCase(key);
        return node.style[camelCaseStyleName];
    }

    function _setCss(node,key,val) {
        var camelCaseStyleName;
        camelCaseStyleName = util.toCamelCase(key);
        /*TODO:if can`t find style*/
        node.style[camelCaseStyleName] = val;
    }
    /*set or read css end*/


    /*add or remove class*/

    function viaAddClass(selector,className) {
        var nodes;
        nodes = viaQueryAll(selector);
        util.each(nodes,function(node,idx){
            _addClass(node,className);
        },nodes);
    }

    function viaRemoveClass(selector,className) {
        var nodes;
        nodes = viaQueryAll(selector);
        util.each(nodes,function(node,idx) {
            _removeClass(node,className);
        },nodes);
    }

    var whiteSpaceReg = /\s+/;
    function _addClass(node,className) {
        var classes;
        classes = node.className.split(whiteSpaceReg);
        if (util.isString(className)) {
            classes.push(className);
        } else if (util.isArray(className)) {
            classes.concat(className);
        }
        classes = util.distinct(classes);
        node.className = classes.join(' ');
    }

    function _removeClass(node,className) {
        var classes,
            clIdx,clLen,
            rmIdx,rmLen;
        classes = node.className.split(whiteSpaceReg);
        if (util.isArray(className)) {
            for(clIdx = 0,clLen = classes.length;clIdx<clLen;clIdx++) {
                for (rmIdx=0,rmLen=className.length;rmIdx<rmLen;rmIdx++) {
                    if (classes[clIdx] == className[rmIdx]) {
                        classes.splice(clIdx,1);
                    }
                }
            }
        } else {
            rmIdx = util.search(classes,className);
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
        if (!util.contain(domEvents,eventType)) {
            throw new Error("unavailable eventType");
        }
        if (element.dispatchEvent) {
            element.dispatchEvent(eventType);
        } else if (element.fireEvent) {
            element.fireEvent('on'+ eventType);
        } else {
            throw 'your browser is not support fire event';
        }
    }

    function viaRemoveDomEvent(element, eventType, eventHandler) {
        if (!util.contain(domEvents,eventType)) {
            throw new Error("unavailable eventType");
        }
        if (element.removeEventListener) {
            if (util.isExist(eventHandler)) {
                element.removeEventListener(eventType,eventHandler);
            } else {
                element.removeEventListener(eventType);
            }
        } else if (element.detachEvent) {
            if (util.isExist(eventHandler)) {
                element.detachEvent('on'+eventType,eventHandler);
            } else {
                element.detachEvent('on'+eventType);
            }

        } else {
            element['on'+eventType] = null;
        }
    }

    function viaAddDomEvent(element, eventType, eventHandler,useCapture) {
        if (!util.contain(domEvents,eventType)) {
            throw new Error("unavailable eventType");
        }
        if (!util.isFunction(eventHandler)) {
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
        var isSelectorReg = /([#.:]\w+([\[:]*([\-\(\)]|\w)+(=[\w_-]+)?[\]]?)?)/ig;
        return isSelectorReg.test(obj);
    }

    function viaIsHtml(obj) {
        var htmlReg = /<(\w+?)(\s?)[^>]+>/g;
        return htmlReg.test(obj);
    }

    function viaIsHtmlTag(obj) {
        var tagNameReg = /^[a-z]+$/i;
        return tagNameReg.test(obj);
    }

    function viaIsHtmlNode(obj) {
        return util.hasProp(obj.tagName);
    }

    function viaIsHtmlNodeList(obj) {
        if (util.isArrayLike(obj)) {
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


    exports.via = via;
    exports.create = viaCreateDom;
    exports.query = viaQuery;
    exports.queryAll = viaQueryAll;
    exports.attr = viaAttr;
    exports.css = viaCss;
    exports.addClass = viaAddClass;
    exports.removeClass = viaRemoveClass;

    exports.isHtmlNode = viaIsHtmlNode;
    exports.isHtmlNodeList= viaIsHtmlNodeList;
    exports.on = viaAddDomEvent;
    exports.trigger = viaTriggerDomEvent;
    exports.remove = viaRemoveDomEvent;
    exports.delegate = viaDelegateDomEvent;

});