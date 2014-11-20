/**
 * Created by little_vege on 2014/11/14.
 */
(function(globe) {
    var via = globe.via,
        oop;
    via.oop = via.oop||{};
    oop = via.oop;

    /*copy from leaflet*/
    function ViaClass() {
        this.initialize.apply(this, arguments);
    }

    ViaClass.prototype = {
        initialize: function(){}
    };

    ViaClass.extend = function(protoProps, staticProps) {
        var parent = this;
        var child;

        if (protoProps && via.util.hasProp(protoProps,'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function() {
                return parent.apply(this,arguments);
            };
        }
        if (staticProps) {
            via.util.extend(child, parent, staticProps);
        }


        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        if (protoProps){
            via.util.extend(child.prototype, protoProps);
        }

        child.__super__ = parent.prototype;

        return child;
    };
    oop.Class = ViaClass;

})(window);