/**
 * Created by little_vege on 2014/11/14.
 */
(function(globe) {
    var via = globe.via,
        oop;
    via.oop = via.oop||{};
    oop = via.oop;
    /*inspration from Leaflet*/
    function ViaClass() {}

    ViaClass.extend = function(descendants) {
        function NewClass() { }
        NewClass.prototype = via.util.create(this.prototype);
        via.util.extend(NewClass.prototype,descendants);
        NewClass.__super__ = this;
        return NewClass;
    };

    oop.createClass = function(descendants) {
        var newClass = new ViaClass();
        return newClass.extend(descendants);
    };
    oop.Class = ViaClass;

})(window);