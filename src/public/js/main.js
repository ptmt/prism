(function (exports) {

    function init() {

        addBrowserClasses(document.body);

       

        var parent = $(".map-container"),
            size = getSize(),
            providerName = parent.data("provider"),
            provider = new MM.StamenTileLayer(providerName);

        var doc = document.documentElement;
        function getSize() {
            return new MM.Point(parent.width(), parent.height());
        }

        // setupProviderSelector(providerName, "../");

        function resize() {
            try {
                size = getSize();
                if (main) main.setSize(size);
            } catch (e) {
            }
            // console.log("resize:", [size.x, size.y]);
        }
        MM.addEvent(window, "resize", resize);

        // our main map
        var main = new MM.Map(parent[0], provider, size,
            [new MM.DragHandler(), new MM.DoubleClickHandler(), new MM.TouchHandler()]);
        parent[0].style.position = "absolute";
        main.autoSize = false;

        if (provider.attribution) {
            var attribution = parent[0].querySelector(".attribution") || parent[0].appendChild(document.createElement("p"));
            attribution.className = "attribution";
            attribution.innerHTML = provider.attribution;
        }

        setupZoomControls(main);

        var didSetLimits = provider.setCoordLimits(main);

        // set the initial map position
        main.setCenterZoom(new MM.Location(82.902, 55.0398), 12);

        var zoom = parseInt(parent.data("zoom"));
        if (!isNaN(zoom)) {
            main.setZoom(zoom);
        }

        var center = parent.data("center");
        if (center && center.length) {
            var bits = center.split(",");
            main.setCenter(new MM.Location(parseFloat(bits[0]), parseFloat(bits[1])));
        }

        syncMapLinks(main, [document.getElementById("home-link")], function (parts) {
            parts.unshift(providerName);
        });

        var embedLink = document.getElementById("embed-toggle"),
            embedToggle;
        if (embedLink) {
            var embed = document.getElementById("embed-content"),
                textarea = document.getElementById("embed-code"),
                template = textarea.value;
            embedToggle = createToggle(embedLink, embed, function (showing) {
                if (showing) {
                    var url = location.href.split("#");
                    url.splice(1, 0, "embed#");
                    textarea.value = template.replace("{url}", url.join(""));
                    textarea.focus();
                    textarea.select();
                } else {
                }
            });
        }

        var imgLink = document.getElementById("make-image");
        if (imgLink) {
            var round = function (n) {
                return Math.ceil(n / 500) * 500;
            };
            MM.addEvent(imgLink, "mouseover", function () {
                var hash = location.hash.substr(1),
                    width = round(main.dimensions.x),
                    height = round(main.dimensions.y);
                this.href = [
                    "http://maps.stamen.com/m2i/",
                    "#" + providerName, "/",
                    width, ":", height, "/",
                    hash
                ].join("");
            });
        }

        var feedback = setupFeedbackForm();
        MM.addEvent(main.parent, "mousedown", feedback.hide);
        main.addCallback("zoomed", feedback.hide);

        var hasher = new MM.Hash(main);

        // set up form element references
        

        exports.MAP = main;
    }

    init();

})(this);

$(function () {

    
    
});
