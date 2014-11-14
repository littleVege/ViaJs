/**
 * Created by little_vege on 2014/11/14.
 */
(function(globe) {
    var via = globe.via,
        oop;
    via.oop = via.oop||{};
    oop = via.oop;
    /*inspration from Leaflet*/
    function ViaClass() {

    }
    ViaClass.extend = function (props) {
        var proto,parentProto,key;
        function NewClass() {
            if (via.util.isExist(this.initialize)) {
                this.initialize.apply(this,arguments);
            }

            this.callInitHooks();
        }

        parentProto = NewClass.__super__ = this.prototype;

        proto = via.util.create(parentProto);
        proto.constructor = NewClass;

        NewClass.prototype = proto;

        //inherit parent's statics
        for (key in this) {
            if (this.hasOwnProperty(key) && key !== 'prototype') {
                NewClass[key] = this[key];
            }
        }

        // mix static properties into the class
        if (props.statics) {
            via.util.extend(NewClass, props.statics);
            delete props.statics;
        }

        // mix includes into the prototype
        if (props.includes) {
            via.util.extend.apply(null, [proto].concat(props.includes));
            delete props.includes;
        }

        // merge options
        if (proto.options) {
            props.options = via.util.extend(via.util.create(proto.options), props.options);
        }

        // mix given properties into the prototype
        via.util.extend(proto, props);

        proto._initHooks = [];

        // add method for calling all hooks
        proto.callInitHooks = function () {
            var index,len;

            if (this._initHooksCalled) { return; }

            if (parentProto.callInitHooks) {
                parentProto.callInitHooks.call(this);
            }

            this._initHooksCalled = true;

            for (index = 0, len = proto._initHooks.length; index < len; index++) {
                proto._initHooks[index].call(this);
            }
        };

        return NewClass;
    };

    // method for adding properties to prototype
    ViaClass.include = function (props) {
        via.util.extend(this.prototype, props);
    };

    // merge new default options to the Class
    ViaClass.mergeOptions = function (options) {
        via.util.extend(this.prototype.options, options);
    };

    // add a constructor hook
    ViaClass.addInitHook = function (fn) { // (Function) || (String, args...)
        var args = Array.prototype.slice.call(arguments, 1);

        var init = typeof fn === 'function' ? fn : function () {
            this[fn].apply(this, args);
        };

        this.prototype._initHooks = this.prototype._initHooks || [];
        this.prototype._initHooks.push(init);
    };

    oop.Class = ViaClass;

})(window);