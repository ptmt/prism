    function init() {

        addBrowserClasses(document.body);

       

        var mapInDom = $(".map-container"),
            size = getSize(),
            providerName = mapInDom.data("provider"),
            provider = new MM.StamenTileLayer(providerName);

        var doc = document.documentElement;
        function getSize() {
            return new MM.Point(mapInDom.width(), mapInDom.height());
        }

        // setupProviderSelector(providerName, "../");

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
        //mapInDom[0].style.position = "absolute";
        mapObject.autoSize = false;

        //if (provider.attribution) {
        //    var attribution = mapInDom[0].querySelector(".attribution") || mapInDom[0].appendChild(document.createElement("p"));
        //    attribution.className = "attribution";
        //    attribution.innerHTML = provider.attribution;
        //}

        var didSetLimits = provider.setCoordLimits(mapObject);

        // set the initial map position
        mapObject.setCenterZoom(new MM.Location(55.0398, 82.902), 12);

       

        //syncMapLinks(mapObject, [document.getElementById("home-link")], function (parts) {
        //    parts.unshift(providerName);
        //});

        

        //var feedback = setupFeedbackForm();
        //MM.addEvent(mapObject.mapInDom, "mousedown", feedback.hide);
        //mapObject.addCallback("zoomed", feedback.hide);

        var hasher = new MM.Hash(mapObject);

        // set up form element references
        

        //exports.MAP = mapObject;
    }





$(function () {
    init();   
    
});
