/**
 * Created by little_vege on 2014/11/14.
 */
define(function(require,exports) {

    var util = require('via.util');

    function ViaClass() {
        this.initialize.apply(this, arguments);
    }

    ViaClass.prototype = {
        initialize: function(){}
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
});