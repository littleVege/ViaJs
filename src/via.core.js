/**
 * Created by little_vege on 2014/11/29.
 */

define(['./via.util','./via.dom','./via.oop'],function(util,dom,oop) {


    /**
     * @module via main instance
     */


    /**
     * @class Via
     */
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
        find:function(selector) {
            var foundElements;
            if (this.any()) {
                if (dom.isSelector(selector)) {
                    foundElements = dom.queryAll(selector,this[0]);
                    return new Via(foundElements);
                }

            }
            return null;
        },
        parent:function(selector) {
            throw "not implement";
        },
        is:function(selector) {
            if (util.isExist(this[0])){
                return dom.matches(this[0],selector);
            }
            return false;
        },
        any:function() {
            return util.isExist(this[0]);
        }
    });

    Via.implement({
        /**
         *
         * @param obj {object|string} attribute key or attributes hash that need to set;
         * @param [val] {string} value of attribute;
         * @returns {*}
         */
        attr:function(obj,val) {
            if (this.any()) {
                if (util.isString(val)) {
                    /*TODO:key can be object or string*/
                    util.each(this, function (element) {
                        dom.setAttribute(element,obj,val);
                    });
                } else {
                    if (util.isObject(obj)) {
                        util.each(this,function(element) {
                            util.each(obj,function(v,k) {
                                dom.setAttribute(element, k, v);
                            });
                        });
                        return this;
                    }
                    return dom.getAttribute(this[0], obj);
                }
            }
            return this;
        },
        /**
         * @method css get or set style;
         * @param obj {object|string} style key or style hash that need to set;
         * @param [val] {string} if get val then set style by given key;
         * @returns {*} this obj or found style
         */
        css:function(obj,val) {
            var key;
            if (val) {
                util.isString(obj)?key = obj:null;
                if (key) {
                    util.each(this,function(node,idx) {
                        dom.setStyle(node,key,val);
                    });
                }
                return this;
            } else {
                if (util.isObject(obj)) {
                    util.each(this,function(node) {
                        util.each(obj,function(v,k) {
                            dom.setStyle(node,k,v);
                        });
                    });
                    /*TODO:need return a string value*/
                    return this;
                } else {
                    if (this.any()&&util.isString(obj)) {
                        return dom.getStyle(this[0],obj);
                    } else {
                        return null;
                    }
                }
            }
        },
        addClass:function(className) {
            util.each(this,function(element) {
                dom.addClass(element,className);
            });
        },
        removeClass:function(className) {
            util.each(this,function(element) {
                dom.removeClass(element,className);
            });
        },
        hasClass:function(className) {
            if (this.any()) {
                return new RegExp(className).test(this[0].className);
            }
            return false;
        },
        text:function() {
            var arg,text;
            arg = arguments;
            if (arg>0) {
                text = arg[0];
            }
            if (util.isExist(text)) {
                util.each(this,function(element) {
                    dom.setText(element,text);
                });
                return this;
            } else {
                if (util.isExist(this[0])) {
                    return dom.getText(this[0]);
                }
            }
        },
        html:function(html) {
            if (util.isExist(html)) {
                util.each(this,function(element) {
                    element.innerHTML = html;
                });
                return this;
            } else {
                if (this.any()) {
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
            if (dom.isHtmlNode(children)) {
                this[0].appendChild(children);
            }
            if (dom.isNodeList(children)||children.toString() === '[object via]') {
                util.each(children,function(element) {
                    this[0].appendChild(element);
                });
            }
            return this;
        },
        appendTo:function(parent) {
            var source;
            if (dom.isHtmlNode(parent)) {
                source = parent;
            } else if (dom.isNodeList(parent)) {
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
                dom.addEventListener(element,type,eventHandler,useCapture);
            });
            return this;
        },
        trigger:function(type) {
            util.each(this,function(element) {
                dom.fireEvent(element,type);
            });
            return this;
        },
        off:function(type,eventHandler) {
            util.each(this,function(element) {
                dom.removeEventListener(element,type,eventHandler);
            });
            return this;
        },
        delegate:function(type,selector,eventHandler) {
            if (this.any()) {
                dom.delegateEvent(this[0],selector,type,eventHandler);
            }
            return this;
        }
    });

    /*show and hide*/
    Via.implement({
        show:function() {
            if (!this.any()) {
                throw new Error('do not have any element');
            }
            util.each(this,function(element,idx){
                if (dom.matches(element,':hidden')) {
                    if (dom.hasStyle(element,'display')){
                        dom.removeStyle(element,'display');
                    } else {
                        dom.setStyle(element,'display','block');
                    }
                }
            })

        },
        hide:function() {
            if (!this.any()) {
                throw new Error('do not have any element');
            }
            util.each(this,function(element) {
                dom.setStyle(element,'display','none');
            });
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

    /**
     *
     * @param selector {string|HTMLElement|HTMLCollection}
     * @param [ctx] {HTMLDocument|HTMLElement}
     * @returns {Via}
     */
    function via(selector,ctx) {
        var nodes;
        if (dom.isSelector(selector)) {
            nodes = dom.queryAll(selector);
        }
        if (dom.isHtml(selector)) {
            nodes = dom.createElement(selector);
        }
        if (dom.isHtmlNode(selector)) {
            nodes = [selector];
        }
        if (dom.isNodeList(selector)) {
            nodes = selector;
        }
        if (!nodes) {
            throw new TypeError('type not allow');
        }
        return new Via(nodes);
    }

    util.extend(via,util,dom);

    return {
        via:via
    }

});







