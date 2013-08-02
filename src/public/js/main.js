var layer;

function initMap() {

    //addBrowserClasses(document.body);      

    var mapInDom = $(".map-container"),
        size = getSize(),
        providerName = mapInDom.data("provider"),
        provider = new MM.StamenTileLayer(providerName);

    layer = new SpotlightLayer();
    layer.spotlight.radius = 30;  

    var doc = document.documentElement;
    function getSize() {        
        return new MM.Point(window.innerWidth, window.innerHeight);
    }        

    function resize() {
        try {
            size = getSize();
            if (mapObject) mapObject.setSize(size);
        } catch (e) {          
        }      
    }
    MM.addEvent(window, "resize", resize);
        
    var mapObject = new MM.Map(mapInDom[0], provider, size,
        [new MM.DragHandler(), new MM.DoubleClickHandler(), new MM.TouchHandler()]);        
    mapObject.autoSize = true;

    mapObject.addLayer(layer);    
        
    var didSetLimits = provider.setCoordLimits(mapObject);
                
    mapObject.setCenterZoom(new MM.Location(55.0398, 82.902), 12);

    var hasher = new MM.Hash(mapObject);        
}

function initSignIn() {
    $.get('/api/account/login').success(function (signinlink) { $('.signin-button').attr('href', signinlink); });        
}

function startProcessing() {
    $('.invite-form').hide();    
    nextStep();
}
function nextStep() {
    $.get('/api/account/nextstep').success(function (data) {
        if (data) {
           // console.log(data);            
            $('.total-distance').html(number_format_default(data.Total.TotalDistance) + ' km');
            $('.total-checkins').html(number_format_default(data.Total.TotalCheckins));
            layer.addLocation(new MM.Location(data.CurrentCheckin.LocationLat, data.CurrentCheckin.LocationLng))
            nextStep();
        }
    });
}
function number_format_default(number) { return number_format(number, 0, ',', ' '); }
function number_format(number, decimals, dec_point, thousands_sep) {   
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

$(function () {
    var isDebug = true;
    if (isDebug)
    {
        startProcessing();
    }
    initMap();
    initSignIn();    
});
