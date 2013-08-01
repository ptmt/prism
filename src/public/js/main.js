function initMap() {

    addBrowserClasses(document.body);      

    var mapInDom = $(".map-container"),
        size = getSize(),
        providerName = mapInDom.data("provider"),
        provider = new MM.StamenTileLayer(providerName);

    var doc = document.documentElement;
    function getSize() {
        return new MM.Point(mapInDom.width(), mapInDom.height());
    }        

    function resize() {
        try {
            size = getSize();
            if (mapObject) mapObject.setSize(size);
        } catch (e) {
        }
        console.log("resize:", [size.x, size.y]);
    }
    MM.addEvent(window, "resize", resize);

    // our mapObject map
    var mapObject = new MM.Map(mapInDom[0], provider, size,
        [new MM.DragHandler(), new MM.DoubleClickHandler(), new MM.TouchHandler()]);        
    mapObject.autoSize = false;
        
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
        console.log(data);
        if (data)
            nextStep();
    });
}

$(function () {
    var isDebug = true;
    if (isDebug)
    {
        $('.invite-form').hide();
    }
    initMap();
    initSignIn();    
});
