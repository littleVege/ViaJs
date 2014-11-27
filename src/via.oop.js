/**
 * Created by little_vege on 2014/11/14.
 */
define(['./via.util'],function(util) {
    var exports = {};
    function ViaClass() {
        this.initialize.apply(this, arguments);
    }

    ViaClass.prototype = {
        initialize: function(){}
    };
    ViaClass.implement = function(properties) {
        var arg;
        arg = util.toArray(arguments);
        arg.unshift(this.prototype);
        util.extend.apply(this,arg);
    };
    ViaClass.extend = function(protoProps, staticProps) {
        var parent = this;
        var child;

        if (protoProps && util.hasProp(protoProps,'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function() {
                return parent.apply(this,arguments);
            };
        }

        util.extend(child, parent, staticProps);

        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        if (protoProps) util.extend(child.prototype, protoProps);

        child.__super__ = parent.prototype;

        return child;
    };

    exports.Class = ViaClass;
    return exports;
});