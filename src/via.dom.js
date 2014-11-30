/**
 * Created by little_vege on 2014/11/11.
 */

define(['./via.util','./via.oop'],function(util,oop) {
    var attriReg = /\w+=['|"]\w+['|"]/g;
    var isCustomFakeClassRe = /:(hidden|visible)$/;

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


    var domEvents = ['click','dbclick','mousemove','mouseover','mouseenter','mouseout','mouseleave','mouseup','mousedown','mousemove',
        'reset','resize','select','submit','abort','blur','change','error','focus',
        'keydown','keypress','keyup',
        'load','unload'
    ];

    var customFakeClasses = {
        hidden:/:hidden/,
        visible:/:visible/
    };


    var dom = {
        isSelector: function(obj) {
            if (!util.isString(obj)){
                return false;
            }
            var isSelectorReg = /^\w+|(\w*[#.:]\w+([\[:]*([\-\(\)]|\w)+(=[\w_-]+)?[\]]?)?)/ig;
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
            return util.hasProp(obj,'tagName');
        },
        isNodeList:function(obj) {
            if (util.isArrayLike(obj)) {
                if (obj.length > 0) {
                    return dom.isHtmlNode(obj[0])||dom.isDocument(obj[0]);
                }
            }
        },
        isDocument:function(obj) {
            return util.isExist(obj.body);
        },
        /**
         *
         * @param element {HtmlElement|EventTarget}
         * @param selector {string}
         * @returns {Boolean}
         */
        matches:function(element,selector) {
            var matchFunc,
                customFakeClass = null,
                matched = false;
            if (isCustomFakeClassRe.test(selector)) {
                selector = selector.replace(isCustomFakeClassRe,function($1) {
                    customFakeClass = $1;
                    return "";
                });
            }
            matchFunc = element.matches||element.webkitMatchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector;

            if (!util.isEmpty(selector)) {
                if (matchFunc) {
                    matched = matchFunc.call(element,selector);
                } else {
                    matched = dom.customMatchs(element, selector);
                }
                if (matched) {  /*TODO:减少重复的matchesFakeClass语句*/
                    if (util.isExist(customFakeClass)) {
                        matched = dom.matchesFakeClass(element,customFakeClass);
                    }
                }
            } else {
                if (util.isExist(customFakeClass)) {
                    matched = dom.matchesFakeClass(element,customFakeClass);
                }
            }
            return matched;
        },
        customMatchs:function(element,selector) {

        },
        matchesFakeClass:function(element,selector) {
            var fakeClassType,index,childsLen,tag;
            util.each(customFakeClasses,function(fakeClassRe,fakeClassName) {
                if (fakeClassRe.test(selector)) {
                    selector = selector.match(fakeClassRe)[0];
                    fakeClassType = fakeClassName;
                    return true;
                }
            });
            switch (fakeClassType) {
                case "hidden":
                    return dom.getStyle(element,'display') === 'none';
                    break;
                case "visible":
                    return dom.getStyle(element,'display') !== 'none';
                    break;
            }
            return false;
        },
        isHidden:function(element) {
            var unvisible = false;
            if (dom.getStyle(element,'display') === 'none') {
                return true;
            }
        }
    };


    util.extend(dom,{
        createElement:function(html) {
            var tmpDom;
            if(util.isString(html)) {
                if (dom.isHtml(html)) {
                    tmpDom = document.createElement('div');
                    tmpDom.innerHTML = html;
                    return tmpDom.childNodes;
                } else if (dom.isHtmlTag(html)) {
                    return document.createElement(html);
                }
            } else {
                throw new TypeError();
            }
        },
        /**
         @method via.query
         @param {string} selector
         @optional {Element} dom context of the selector, optional
         @return {HTMLElement} return query result
         */
        query:function(selector) {
            var ctx;
            if (arguments.length>1) {
                ctx = arguments[1];
            }
            ctx = ctx||document;
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
         @method dom.queryAll
         @param {string} selector
         @param {HTMLElement|HTMLDocument|Node} [context] context of the selector, optional
         @return {NodeList|Array} return query result
         */
        queryAll:function(selector,context) {
            if (!context) {
                context = document;
            }
            if (dom.isSelector(selector)) {
                if (context.querySelectorAll) {
                    return context.querySelectorAll(selector);
                } else {
                    throw "not implement yet!";
                    /*TODO:use sizzle to query selector*/
                }
            }
        },
        indexAt:function(elements,idx,elementType) {
            var indexOfType,
                foundElement = null;
            if (elementType) {
                util.each(elements,function(element) {
                    if (element.tagName.toLowerCase() === elementType) {
                        indexOfType++;
                    }
                    if (indexOfType == idx) {
                        foundElement = element;
                        return true;
                    }
                });
                return foundElement;
            }else{
                return elements[idx];
            }
        },
        indexOf:function(elements,element) {

        },
        filterElements:function(elements,selector) {
            var fited = [];
            if (isCustomFakeClassRe.test(selector)) {

            }
        }
    });


    util.extend(dom,{
        /**
         *
         * @param element {HTMLElement} dom element which need to add event
         * @param eventType {string} event type
         * @param eventHandler {function} event handler
         * @param [useCapture] {boolean} bobble event or capture event?
         */
        addEventListener:function(element,eventType,eventHandler,useCapture) {
            if (!util.contain(domEvents,eventType)) {
                throw new Error("unavailable eventType");
            }
            if (!util.isFunction(eventHandler)) {
                return;
            }
            useCapture = useCapture||false;
            if (element.addEventListener) {
                element.addEventListener(eventType,eventHandler,useCapture);
            } else if (element.attachEvent) {
                element.attachEvent('on'+eventType,eventHandler);
            } else {
                element['on'+eventType] = eventHandler;
            }
        },
        /**
         *
         * @param element {HTMLElement} dom element which need to remove event
         * @param eventType {string} event type
         * @param [eventHandler] {function} event handler
         */
        removeEventListener:function(element,eventType,eventHandler) {
            if (!util.contain(domEvents,eventType)) {
                throw new Error("unavailable eventType");
            }
            if (element.removeEventListener) {
                if (util.isExist(eventHandler)) {
                    element.removeEventListener(eventType,eventHandler);
                } else {
                    element['on'+eventType] = null;
                }
            } else if (element.detachEvent) {
                if (util.isExist(eventHandler)) {
                    element.detachEvent('on'+eventType,eventHandler);
                } else {
                    element['on'+eventType] = null;
                }
            } else {
                element['on'+eventType] = null;
            }
        },
        /**
         *
         * @param element {HTMLElement} dom element which need to remove event
         * @param eventType {string} event type
         */
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
        /**
         *
         * @param element {HTMLElement} dom element which need to remove event
         * @param eventType {string} event type
         * @param selector {string} child selector
         * @param eventHandler {function} event handler
         */
        delegateEvent:function(element,selector,eventType,eventHandler) {
            if (!dom.isHtmlNode(element)) {
                throw new TypeError('type can only be htmlNode');
            }
            dom.addEventListener(element,eventType,function(e) {
                var ev,target;
                ev = e||window.event;
                target = ev.target||ev.srcElement;
                if (dom.matches(target,selector)) {
                    eventHandler.call(target,e);
                }
            });
        }
    });


    util.extend(dom,{
        /**
         * @function getStyle get Css By key
         * @param element {HTMLElement|EventTarget}
         * @param key {string}
         * @returns {string}
         */
        getStyle:function(element,key) {
            var camelCaseStyleName;
            camelCaseStyleName = util.toCamelCase(key);
            return element.style[camelCaseStyleName];
        },
        setStyle:function(element,key,val) {
            var camelCaseStyleName;
            camelCaseStyleName = util.toCamelCase(key);
            /*TODO:if can`t find style*/
            element.style[camelCaseStyleName] = val;
        },
        removeStyle:function(element,key) {
            var style;
            style = element.style;
            if (style.removeAttribute) {
                style.removeAttribute(key);
            } else {
                style.removeProperty(key);
            }
            return key;
        },
        hasStyle:function(element,key) {
            var camalCaseStyleName;
            camalCaseStyleName = util.toCamelCase(key);
            return util.isExist(element.style[key]);
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
        },
        hasAttribute:function(element,key) {
            return element.hasAttribute(key);
        },
        getAllAttributes:function(element) {
            return element.attributes;
        }

    });

    return dom;

});