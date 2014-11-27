/**
 * Created by little_vege on 2014/11/11.
 */

define(['./via.util','./via.oop'],function(util,oop) {
    var attriReg = /\w+=['|"]\w+['|"]/g;
    var exports = {};

    var Via = oop.Class.extend({
        initialize:function(nodeList) {
            var idx,len=0;
            if (via.isArray(nodeList)||via.isArrayLike(nodeList)) {
                for (idx=0,len = nodeList.length;idx<len;idx++) {
                    this[idx] = nodeList[idx];
                }
            }
            this.length = len;
        },
        find:function(selector) {
            if (this[0]&&via.isSelector(selector)) {
                return new Via(via.queryAll(selector,this[0]));
            }
            return null;
        },
        parent:function(selector) {
            throw "not implement";
        },
        is:function(selector) {
            if (util.isExist(this[0])){
                return via.isMatchesSelector(this[0],selector);
            }
            return false;
        },
        toString:function() {
            return "[object via]"
        },
        any:function() {
            return util.isExist(this[0]);
        }
    });

    Via.implement({
        attr:function(key) {
            var arg,argLen,val;
            arg = arguments;
            argLen = arguments.length;
            if (this.length>0) {
                if (argLen > 1) {
                    val = arg[1];
                    /*TODO:key can be object or string*/
                    via.each(this, function (node, idx) {
                        via.setAttribute(node, key, val);
                    });
                    return this;
                } else {
                    if (this[0]) {
                        return via.getAttribute(this[0], key);
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
                via.each(this,function(node,idx) {
                    via.setCss(node,key,val);
                });
                return this;
            } else {
                if (via.isObject(key)) {
                    via.each(this,function(node,idx) {
                        via.each(key,function(val,key) {
                            via.setCss(node,key,val);
                        });
                    });
                    /*TODO:need return a string value*/
                    return this;
                } else {
                    if (this[0]) {
                        return via.getCss(this[0],key);
                    } else {
                        return null;
                    }

                }
            }
        },
        addClass:function(className) {
            util.each(this,function(element) {
                via.addClass(element,className);
            });
        },
        removeClass:function(className) {
            util.each(this,function(element) {
                via.removeClass(element,className);
            });
        },
        text:function() {
            var arg,text;
            arg = arguments;
            if (arg>0) {
                text = arg[0];
            }
            if (util.isExist(text)) {
                util.each(this,function(element) {
                    via.setText(element,text);
                });
                return this;
            } else {
                if (util.isExist(this[0])) {
                    return via.getText(this[0]);
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
        }
    });

    Via.implement({
        append:function(children) {
            if (!this.any()) {
                throw new RangeError('do not have any html element');
            }
            if (via.isHtmlNode(children)) {
                this[0].appendChild(children);
            }
            if (via.isNodeList(children)||children.toString() === '[object via]') {
                util.each(children,function(element) {
                    this[0].appendChild(element);
                });
            }
            return this;
        },
        appendTo:function(parent) {
            var source;
            if (via.isHtmlNode(parent)) {
                source = parent;
            } else if (via.isNodeList(parent)) {
                source = parent[0];
            }
            if (source) {
                util.each(this,function(element) {
                    source.appendChild(element);
                });
            }
            return this;
        }
    });


    Via.implement({
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
            util.each(this,function(element) {
                via.addEventListener(element,type,eventHandler,useCapture);
            });
            return this;
        },
        trigger:function(type) {
            util.each(this,function(element) {
                via.fireEvent(element,type);
            });
        },
        off:function(type,eventHandler) {
            util.each(this,function(element) {
                via.removeEventListener(element,type,eventHandler);
            })
        },
        delegate:function(type,selector,eventHandler) {
            if (this.any()) {
                via.delegateEvent(this[0],selector,type,eventHandler);
            }
        }
    });

    var ViaEvent = oop.Class.extend({
        initialize:function(event) {
            var ev;
            ev = event||window.event;
            this._ev = ev;
            this.target = ev.target || ev.srcElement;
        },
        scrollHeight:function() {

        },
        scrollWidth:function() {

        },
        clientHeight:function() {

        },
        clientWidth:function() {

        },
        offsetHeight:function() {

        },
        offsetWidth:function() {

        },
        offsetRect:function() {

        },
        boundaryRect:function() {

        }
    });



    var via = function(selector) {
        var nodes;
        if (via.isSelector(selector)) {
            nodes = via.queryAll(selector);
        }
        if (via.isHtml(selector)) {
            nodes = via.createElement(selector);
        }
        if (via.isHtmlTag(selector)) {
            nodes = [via.createElement(selector)];
        }
        if (via.isHtmlNode(selector)) {
            nodes = [selector];
        }
        if (via.isNodeList(selector)) {
            nodes = selector;
        }
        if (!nodes) {
            throw new TypeError('type not allow');
        }
        return new Via(nodes);
    };

    util.extend(via,util);

    via.implement = function(){
        var arg;
        arg = via.toArray(arguments);
        arg.unshift(via);
        via.extend.apply(this,arg);
    };

    via.implement({
        createElement:function(html) {
            var tmpDom;
            if(util.isString(html)) {
                if (via.isHtml(html)) {
                    tmpDom = document.createElement('div');
                    tmpDom.innerHTML = html;
                    return tmpDom.childNodes;
                } else if (via.isHtmlTag(html)) {
                    return document.createElement(html);
                }
            } else {
                throw new TypeError();
            }
        },
        /**
         @method via.query
         @param {string} selector
         @optional {Node} dom context of the selector, optional
         @return {Node} return query result
         */
        query:function(selector) {
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
        },
        /**
         @method via.filter
         @param {string|NodeList|Node} selector
         @optional {Node} dom context of the selector, optional
         @return {NodeList} return query result
         */
        queryAll:function(selector) {
            var dom = document;
            if (arguments.length>1) {
                dom = arguments[1];
            }
            if (via.isSelector(selector)) {
                if (dom.querySelectorAll) {
                    return dom.querySelectorAll(selector);
                } else {
                    throw "not implement yet!";
                    /*TODO:use sizzle to query selector*/
                }
            } else if (via.isHtmlNode(selector)) {
                return [selector];
            } else if (via.isNodeList(selector)) {
                return selector;
            } else {
                throw new TypeError('first argument should be selector or htmlNode or htmlNodeList');
            }
        },
        getCss:function(element,key) {
            var camelCaseStyleName;
            camelCaseStyleName = util.toCamelCase(key);
            return element.style[camelCaseStyleName];
        },
        setCss:function(element,key,val) {
            var camelCaseStyleName;
            camelCaseStyleName = util.toCamelCase(key);
            /*TODO:if can`t find style*/
            element.style[camelCaseStyleName] = val;
        },
        addEventListener:function(element,eventType,eventHandler,useCapture) {
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
        },
        removeEventListener:function(element,eventType,eventHandler) {
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
        },
        fireEvent:function(element,eventType) {
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
        },
        delegateEvent:function(element,selector,type,eventHandler) {
            if (!via.isHtmlNode(element)) {
                throw new TypeError('type can only be htmlNode');
            }
            via.addEventListener(element,type,function(e) {
                var ev,target;
                ev = e||window.event;
                target = ev.target||ev.srcElement;
                if (via.isMatchesSelector(target,selector)) {
                    eventHandler.call(target,e);
                }
            });
        },
        setText:function(element,text) {
            if (util.isExist(element.innerText)) {
                element.innerText = text;
            }else if (util.isExist(element.textContent)) {
                element.textContent = text;
            } else {
                element.innerHTML = util.escape(text);
            }
        },
        getText:function(element) {
            if (util.isExist(element.innerText)) {
                return element.innerText;
            }else if (util.isExist(element.textContent)) {
                return element.textContent;
            } else {
                /*TODO：有问题*/
                return this.removeHtmlTags(element.innerHTML);
            }
        },
        removeHtmlTags:function(html) {
            return html;
        },
        addClass:function(element,className) {
            var classes;
            classes = element.className.split(/\w+/g);
            if (util.isString(className)) {
                classes.push(className);
            } else if (util.isArray(className)) {
                classes.concat(className);
            }
            classes = util.distinct(classes);
            element.className = classes.join(' ');
        },
        removeClass:function(element,className) {
            var classes,
                clIdx,clLen,
                rmIdx,rmLen;
            classes = element.className.split(/\w+/g);
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
        },
        setAttribute:function(element,key,val) {
            /*TODO:ie fixed attribute*/
            if (key == "style") {
                element.style.setAttribute('cssText',val);
            } else {
                element.setAttribute(key,val);
            }
        },
        getAttribute:function(element,key) {
            /*TODO:ie fixed attribute*/
            return element.getAttribute(key);
        }

    });


    /*set or read attribute*/

    var IEfixAttr = {
        acceptcharset: "acceptCharset",
        accesskey: "accessKey",
        allowtransparency: "allowTransparency",
        bgcolor: "bgColor",
        cellpadding: "cellPadding",
        cellspacing: "cellSpacing",
        "class": "className",
        colspan: "colSpan",
        checked: "defaultChecked",
        selected: "defaultSelected",
        "for": "htmlFor",
        frameborder: "frameBorder",
        hspace: "hSpace",
        longdesc: "longDesc",
        maxlength: "maxLength",
        marginwidth: "marginWidth",
        marginheight: "marginHeight",
        noresize: "noResize",
        noshade: "noShade",
        readonly: "readOnly",
        rowspan: "rowSpan",
        tabindex: "tabIndex",
        valign: "vAlign",
        vspace: "vSpace"
    };

    /*set or read attribute end*/

    /*set or read css*/


    /*set or read css end*/


    /*add or remove class*/


    /*add or remove class*/

    /*dom eventListener*/

    var domEvents = ['click','dbclick','mousemove','mouseover','mouseenter','mouseout','mouseleave','mouseup','mousedown','mousemove',
        'reset','resize','select','submit','abort','blur','change','error','focus',
        'keydown','keypress','keyup',
        'load','unload'];

    /*eventListener end*/

    /*event delegate*/

    /*event delegate end*/


    /*test given obj is dom(selector|node|nodeList|html)*/

    via.implement({
        isSelector: function(obj) {
            if (!via.isString(obj)){
                return false;
            }
            var isSelectorReg = /([#.:]\w+([\[:]*([\-\(\)]|\w)+(=[\w_-]+)?[\]]?)?)/ig;
            return isSelectorReg.test(obj);
        },
        isHtml:function(obj) {
            var htmlReg = /<(\w+?)(\s?)[^>]+>/g;
            return htmlReg.test(obj);
        },
        isHtmlTag:function(obj) {
            var tagNameReg = /^[a-z]+$/i;
            return tagNameReg.test(obj);
        },
        isHtmlNode:function(obj) {
            return via.hasProp(obj,'tagName');
        },
        isNodeList:function(obj) {
            if (util.isArrayLike(obj)) {
                if (obj.length > 0) {
                    return via.isHtmlNode(obj[0])||via.isDocument(obj[0]);
                }
            }
        },
        isDocument:function(obj) {
            return via.isExist(obj.body);
        },
        /**
         *
         * @param {HtmlElement|EventTarget} element
         * @param {String} selector
         * @returns {*}
         */
        isMatchesSelector:function(element,selector) {
            var matchFunc;
            matchFunc = element.matches||element.webkitMatchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector;
            if (matchFunc) {
                return matchFunc.call(element,selector);
            } else {
                viaMatchs(element, selector);
            }
        }
    });




    function viaMatchs(node,selector){

    }

    /*test given obj is dom end*/


    /*module end*/


    exports.via = via;

    return exports;

});