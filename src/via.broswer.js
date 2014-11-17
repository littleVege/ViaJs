/**
 * Created by little_vege on 2014/11/16.
 */
(function(globe,navi) {
    globe.via = globe.via||{};
    var via = globe.via;
    via.broswer = via.broswer||{};
    var broswer = via.broswer;

    var Sys = {};
    var ua = navi.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

})(window,navigator);