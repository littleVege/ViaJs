/**
 * Created by little_vege on 2014/11/11.
 */
(function(globe) {
    globe.via = globe.via||{};
    var via = globe.via;
    var document = globe.document;

    /**
     @method via.filter
     @param {string} selector
     @param {Node} dom context of the selector, optional
     @return {NodeList} return query result
    */
    function viaQueryAll(selector,dom) {
        dom = dom||document;
        if (dom.querySelectorAll) {
            return dom.querySelectorAll(selector);
        } else {
            throw "not implement yet!";
            /*TODO:use sizzle to query selector*/
        }
    }

    /**
     @method via.query
     @param {string} selector
     @param {Node} dom context of the selector, optional
     @return {Node} return query result
     */
    function viaQuery(selector,dom) {
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
    var htmlReg = /<(\w+?)(\s?)[^>]+>/g;
    var tagNameReg = /^<\w+/i;
    var attriReg = /\w+=['|"]\w+['|"]/g;

    /**
     @method via.createElement
     @param {String|Node|NodeList} ele element;
     @return {NodeList|Node} parsed element list;
    */
    function viaCreateElement(ele) {
        var tmpDom,parsedDom;
        if (htmlReg.test(ele)) {
            tmpDom = document.createElement('div');
            tmpDom.innerHTML = ele;
            return tmpDom.childNodes;
        } else if (isHTMLNode(ele) || isHTMLNodeList(ele)) {
            return ele;
        } else if (/\w+/.test(ele)) {
            return document.createElement(ele);
        }
    }

    function _createElementByDomString(domstring) {
        var tagName,element,attributes, i,len,attriPair;
        tagName = domstring.match(tagNameReg)[0];
        tagName = tagName.substring(1,tagName.length);
        element = document.createElement(tagName.toLowerCase());
        attributes = domstring.match(attriReg);
        for (i=0,len=attributes.length;i<len;i++) {
            attriPair = _parseAttrStr2KeyVal(attributes[i]);
            _setAttribute(element,attriPair.key,attriPair.val);
        }
        return element;
    }

    var IEfix = {
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
        if (key == "style") {
            dom.style.setAttribute('cssText',val);
        } else {
            dom.setAttribute(key,val);
        }
    }

    function _parseAttrStr2KeyVal(attributeStr) {
        var pair,key,val;
        pair = attributeStr.split('=');
        key = pair[0];
        val = pair[1].replace(/^['|"]+|['|"]+$]/g,'');
        return {
            key:key,
            val:val
        }
    }

    function isHTMLNode(obj) {
        return via.util.isExist(obj.tagName);
    }

    function isHTMLNodeList(obj) {
        var flag = false;
        flag = via.util.isExist(obj.item) && via.util.isExist(obj.length) && !via.util.isArray(obj);
        return flag;
    }

    via.query = viaQuery;
    via.filter = viaQueryAll;
    via.createElement = viaCreateElement;


    /*module end*/
})(window);
