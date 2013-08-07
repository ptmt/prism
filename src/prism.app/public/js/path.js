var Path = function (canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.startDate = Date.parse("2013-01-01T10:51:52");
    this.endDate = new Date();
};

Path.prototype = {


    // clearing resets the canvas and fills it with the fillStyle
    clear: function () {
        this.canvas.width = this.canvas.width;
        this.ctx.globalCompositeOperation = "source-over";
        //  this.fill();
    },

    getColor: function (currentDate) {
        return (765 / (this.endDate - this.startDate) * (currentDate - this.startDate));
    },

    drawPoint: function (point, prevpoint, map) {
        var p1 = map.coordinatePoint(point.coord);
        var p2 = map.coordinatePoint(prevpoint.coord);
        this.ctx.beginPath();
        this.ctx.moveTo(p2.x, p2.y);
        this.ctx.lineTo(p1.x, p1.y);
        this.ctx.lineWidth = 1;
        timeCode = Date.parse(point.createdat);

        var red = Math.round(this.getColor(timeCode));
        if (red > 255) red = 255;
        var green = Math.round(this.getColor(timeCode) - 255);
        if (green < 0) green = 0;
        if (green > 255) green = 255;
        var blue = Math.round(this.getColor(timeCode) - 510);
        if (blue < 0) blue = 0;
        if (blue > 255) blue = 255;
        console.log('rgb(' + red + ',' + green + ',' + blue + ')');

        this.ctx.strokeStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        this.ctx.stroke();
    },

    drawPoints: function (points, map) {
        if (points.length > 1) {
            for (var i = 1; i < points.length; i++) {
                var p = points[i];
                this.ctx.beginPath();
                this.ctx.moveTo(points[i - 1].x, points[i - 1].y);
                this.ctx.lineTo(p.x, p.y);
                this.drawPoint(points[i], points[i - 1], map);
            }
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
        this.drawlast();
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

    drawlast: function () {
        var map = this.map,
            canvas = this.parent;
        if (this.locations.length > 1)
            this.path.drawPoint(
        		this.locations[this.locations.length - 1]
        		, this.locations[this.locations.length - 2]
        		, map
        		);
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
            this.path.drawPoints(this.locations, map);
        } else {
            this.path.clear();
        }
    }
};