var Path = function (canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
};

Path.prototype = {


    // clearing resets the canvas and fills it with the fillStyle
    clear: function () {
        this.canvas.width = this.canvas.width;
        this.ctx.globalCompositeOperation = "source-over";
        //  this.fill();
    },
    /**
     * Draw an array of points ({x, y}) as white circles. Each circle may
     * define its own radius, or we fall back on the value radius argument.
     */
    drawPoints: function (points) {
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            this.ctx.beginPath();
            this.ctx.line()
            this.ctx.closePath();

        }
    },


};

var PathLayer = function (canvas, fillStyle) {
    this.parent = canvas || document.createElement("canvas");
    this.parent.style.position = "absolute";
    this.path = new Path(this.parent);
    this.locations = [];
};

PathLayer.prototype = {
    positioned: false,
    locations: null,

    addLocation: function (loc) {
        if (this.map) {
            loc.coord = this.map.locationCoordinate(loc);
        }
        this.locations.push(loc);
        this.draw();
    },

    removeLocation: function (loc) {
        var len = this.locations.length,
            removed = false;
        for (var i = 0; i < len; i++) {
            if (this.locations[i] === loc) {
                this.locations.splice(i, 1);
                removed = true;
                break;
            }
        }
        if (removed) {
            this.draw();
        }
    },

    removeAllLocations: function () {
        this.locations = [];
        this.draw();
    },

    draw: function () {
        var map = this.map,
            canvas = this.parent;

        if (canvas.parentNode != map.parent) {
            map.parent.appendChild(canvas);
        }

        canvas.width = map.dimensions.x;
        canvas.height = map.dimensions.y;

        if (this.locations && this.locations.length) {
            var points = this.locations.map(function (loc) {
                var coord = loc.coord || (loc.coord = map.locationCoordinate(loc)),
                    point = map.coordinatePoint(coord);
                if ("radius" in loc) point.radius = loc.radius;
                return point;
            });
            this.path.drawPoints(points);
        } else {
            this.path.clear();
        }
    }
};